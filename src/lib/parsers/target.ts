import {
  TransactionData,
  ParserResult,
  CSVParser,
  tryFindCategory,
  CATEGORY_TO_MERCHANTS,
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

    const id = fields[11] && fields[11] !== "" ? fields[11] : undefined;
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

    return {
      id,
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
