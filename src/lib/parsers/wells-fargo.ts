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

export class WellsFargoParser implements CSVParser {
  parse(csvContent: string, filename: string): ParserResult {
    const rows = parseCSVData(csvContent, 0); // No header to skip
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
        console.warn(`Error parsing Wells Fargo row ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "Wells Fargo",
      accountType: "bank",
    };
  }

  private parseRow(fields: string[]): TransactionData | null {
    if (fields.length < 5) return null;

    const date = new Date(fields[0]);
    const amount = parseFloat(fields[1]);
    const merchant = fields[4];

    const category = tryFindCategory(merchant, CATEGORY_TO_MERCHANTS);

    return {
      id: generateTransactionId(date, amount, merchant),
      date,
      amount: amount,
      merchant,
      category: category || undefined,
      note: undefined,
      custom_category: undefined,
    };
  }

}
