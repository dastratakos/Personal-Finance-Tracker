import { Decimal } from "@prisma/client/runtime/library";
import {
  ParserResult,
  CSVParser,
  TransactionData,
  tryFindCategory,
  CATEGORY_TO_MERCHANTS,
  removeChars,
  generateTransactionId,
} from "../import-utils";

const MERCHANT_TO_NOTE: Record<string, string> = {
  "AMEX EPAYMENT ACH PMT": "Amex credit card bill",
  "BILTPYMTS RENT PMT": "Bilt housing",
  "FIVE RINGS": "Five Rings pay check",
  "INTEREST CREDIT": "Interest",
  TARGET: "Target credit card bill",
  VANGUARD: "Vanguard",
  "VENMO CASHOUT": "Venmo",
  "WF Credit Card AUTO PAY": "WF credit card bill",
};

export class CITParser implements CSVParser {
  parse(csvContent: string, filename: string): ParserResult {
    const lines = csvContent.split("\n").filter((line) => line.trim());
    const transactions: TransactionData[] = [];

    // Skip header line
    const dataLines = lines.slice(1);

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      if (!line.trim()) continue;

      try {
        const transaction = this.parseLine(line);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (error) {
        console.warn(`Error parsing CIT line ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "CIT",
      accountType: "bank",
    };
  }

  private parseLine(line: string): TransactionData | null {
    const fields = this.parseCSVLine(line);
    if (fields.length < 6) return null;

    const date = new Date(fields[0]);
    let amount: number;

    if (fields[2] === "CREDIT") {
      // old format is "421.86", new format is "$421.86"
      amount = parseFloat(fields[5].replace("$", ""));
    } else if (fields[2] === "DEBIT") {
      // old format is "(1088.00)", new format is "$-1088.00"
      amount = -1 * Math.abs(parseFloat(removeChars(fields[4], "()$")));
    } else {
      console.warn(`Unexpected Transaction Type: ${fields[2]}`);
      return null;
    }

    const merchant = fields[3];
    const category = tryFindCategory(merchant, CATEGORY_TO_MERCHANTS);

    let note: string | null = null;
    for (const [merchantPattern, noteText] of Object.entries(
      MERCHANT_TO_NOTE
    )) {
      if (merchant.includes(merchantPattern)) {
        note = noteText;
        break;
      }
    }

    const id = generateTransactionId(date, amount, merchant);

    return {
      id,
      date,
      amount: amount,
      merchant: merchant || undefined,
      category: category || undefined,
      note: note || undefined,
      custom_category: undefined,
    };
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }
}
