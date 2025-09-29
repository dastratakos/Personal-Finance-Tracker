import { Decimal } from "@prisma/client/runtime/library";
import {
  ParserResult,
  CSVParser,
  TransactionData,
  tryFindCategory,
  CATEGORY_TO_MERCHANTS,
  generateTransactionId,
} from "../import-utils";
import { parseCSVData } from "../csv-utils";

export class TargetParser implements CSVParser {
  parse(csvContent: string, filename: string): ParserResult {
    const rows = parseCSVData(csvContent, 2); // Skip 2 header lines
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
        console.warn(`Error parsing Target row ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "Target",
      accountType: "credit_card",
    };
  }

  private parseRow(fields: string[]): TransactionData | null {
    if (fields.length < 12) return null;

    const date = new Date(fields[2]);
    let amount = parseFloat(fields[10].replace(/[()$]/g, ""));

    if (fields[3] === "Debit") {
      amount *= -1;
    }

    let merchant = fields[5].trim();
    if (merchant === "TARGET") {
      const merchantCity = fields[6];
      const merchantState = fields[7];
      merchant = `Target - ${merchantCity}, ${merchantState}`;
    }

    const category = tryFindCategory(merchant, CATEGORY_TO_MERCHANTS);
    const id =
      fields[11] && fields[11] !== ""
        ? fields[11]
        : generateTransactionId(date, amount, merchant);

    return {
      id,
      date,
      amount: amount,
      merchant: merchant || undefined,
      category: category || undefined,
      note: undefined,
      custom_category: undefined,
    };
  }

}
