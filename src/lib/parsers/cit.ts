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
import { parseCSVData } from "../csv-utils";

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
    const rows = parseCSVData(csvContent, 1); // Skip header line
    const transactions: TransactionData[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      try {
        const transaction = this.parseRow(row);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (error) {
        console.warn(`Error parsing CIT row ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "CIT",
      accountType: "bank",
    };
  }

  private parseRow(fields: string[]): TransactionData | null {
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
    let category = tryFindCategory(merchant, CATEGORY_TO_MERCHANTS);
    
    // Special handling for known transfer merchants
    if (!category && (merchant.includes("TARGET") || merchant.includes("VENMO") || merchant.includes("VANGUARD"))) {
      category = "Transfer";
    }

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

}
