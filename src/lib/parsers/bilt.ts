import {
  ParserResult,
  CSVParser,
  TransactionData,
  tryFindCategory,
  CATEGORY_TO_MERCHANTS,
} from "../import-utils";
import { parseCSVData } from "../csv-utils";

export class BiltParser implements CSVParser {
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
        console.warn(`Error parsing Bilt row ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "Bilt",
      accountType: "credit_card",
    };
  }

  private parseRow(fields: string[]): TransactionData | null {
    if (fields.length < 5) return null;

    const date = new Date(fields[0]);
    const amount = parseFloat(fields[1]);
    const merchant = fields[4];

    const category = tryFindCategory(merchant, CATEGORY_TO_MERCHANTS);

    return {
      id: undefined,
      date,
      amount,
      merchant,
      category: category || undefined,
      note: undefined,
      custom_category: undefined,
    };
  }

}
