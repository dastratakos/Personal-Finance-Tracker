import {
  ParserResult,
  CSVParser,
  TransactionData,
  tryFindCategory,
  CATEGORY_TO_MERCHANTS,
  generateTransactionId,
} from "../import-utils";

export class WellsFargoParser implements CSVParser {
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
        console.warn(`Error parsing Wells Fargo line ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "Wells Fargo",
      accountType: "bank",
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
      id: generateTransactionId(date, amount, merchant),
      accountId: "", // Will be set by the import service
      date,
      amount: new Decimal(amount),
      merchant,
      category: category || null,
      note: null,
      custom_category: null,
      isManual: false,
      importedAt: new Date(),
      importId: null,
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
