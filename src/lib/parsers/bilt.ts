import {
  TransactionData,
  ParserResult,
  CSVParser,
  tryFindCategory,
  CATEGORY_TO_MERCHANTS,
} from "../import-utils";

export class BiltParser implements CSVParser {
  parse(csvContent: string, filename: string): ParserResult {
    const lines = csvContent.split("\n").filter((line) => line.trim());
    const transactions: TransactionData[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      try {
        const transaction = this.parseLine(line);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (error) {
        console.warn(`Error parsing Bilt line ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "Bilt",
      accountType: "credit_card",
    };
  }

  private parseLine(line: string): TransactionData | null {
    const fields = this.parseCSVLine(line);
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
