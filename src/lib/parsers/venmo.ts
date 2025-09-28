import {
  TransactionData,
  ParserResult,
  CSVParser,
  removeChars,
} from "../import-utils";

export class VenmoParser implements CSVParser {
  parse(csvContent: string, filename: string): ParserResult {
    const lines = csvContent.split("\n").filter((line) => line.trim());
    const transactions: TransactionData[] = [];

    // Skip header lines (4) and footer (1)
    const dataLines = lines.slice(4, -1);

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      if (!line.trim()) continue;

      try {
        const transaction = this.parseLine(line);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (error) {
        console.warn(`Error parsing Venmo line ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "Venmo",
      accountType: "venmo",
    };
  }

  private parseLine(line: string): TransactionData | null {
    const fields = this.parseCSVLine(line);
    if (fields.length < 16) return null;

    const id = fields[1];
    const date = new Date(fields[2]);
    const amount = parseFloat(removeChars(fields[8], " +$,"));

    const merFrom = fields[6];
    const merTo = fields[7];
    const merchant = merFrom !== "Dean Stratakos" ? merFrom : merTo;

    let category: string | undefined;
    const note = fields[5];

    // Amex split
    let amexSplitAmount: string | undefined;
    if (note.toUpperCase() === note && amount >= 0) {
      amexSplitAmount = amount.toFixed(2);
      category = "Transfer";
    }

    const fundingSource = fields[14];
    const destination = fields[15];

    if (fundingSource !== "Venmo balance" && destination !== "Venmo balance") {
      category = "Transfer";

      const type = fields[3];
      if (type === "Standard Transfer") {
        // merchant should be empty for standard transfers
        return {
          id,
          date,
          amount: 0,
          merchant: destination,
          category,
          note: type,
          custom_category: amexSplitAmount,
        };
      } else {
        return {
          id,
          date,
          amount: 0,
          merchant,
          category,
          note: `[${amount} from ${fundingSource}] ${note}`,
          custom_category: amexSplitAmount,
        };
      }
    }

    return {
      id,
      date,
      amount,
      merchant,
      category,
      note,
      custom_category: amexSplitAmount,
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
