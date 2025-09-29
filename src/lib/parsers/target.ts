import {
  ParserResult,
  CSVParser,
  TransactionData,
  tryFindCategory,
  CATEGORY_TO_MERCHANTS,
  generateTransactionId,
} from "../import-utils";

export class TargetParser implements CSVParser {
  parse(csvContent: string, filename: string): ParserResult {
    const lines = csvContent.split("\n").filter((line) => line.trim());
    const transactions: TransactionData[] = [];

    // Skip header lines (2)
    const dataLines = lines.slice(2);

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      if (!line.trim()) continue;

      try {
        const transaction = this.parseLine(line);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (error) {
        console.warn(`Error parsing Target line ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "Target",
      accountType: "credit_card",
    };
  }

  private parseLine(line: string): TransactionData | null {
    const fields = this.parseCSVLine(line);
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
