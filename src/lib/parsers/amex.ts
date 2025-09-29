import {
  ParserResult,
  CSVParser,
  TransactionData,
  tryFindCategory,
  CATEGORY_TO_MERCHANTS,
} from "../import-utils";

const AMEX_CATEGORY_TO_MY_CATEGORY: Record<string, string | null> = {
  "Entertainment-Theatrical Events": "Entertainment",
  "Merchandise & Supplies-Clothing Stores": "Clothing",
  "Merchandise & Supplies-Department Stores": null,
  "Merchandise & Supplies-Florists & Garden": null,
  "Merchandise & Supplies-General Retail": null,
  "Merchandise & Supplies-Groceries": "Groceries",
  "Merchandise & Supplies-Pharmacies": "Groceries",
  "Other-Miscellaneous": null,
  "Restaurant-Bar & Café": null,
  "Restaurant-Restaurant": "Food",
  "Transportation-Other Transportation": "Daily Transport",
  "Travel-Airline": "Travel",
};

export class AmexParser implements CSVParser {
  parse(csvContent: string, filename: string): ParserResult {
    const lines = csvContent.split("\n").filter((line) => line.trim());
    const transactions: TransactionData[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      try {
        const transaction = this.parseLine(line);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (error) {
        console.warn(`Error parsing Amex line ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "Amex",
      accountType: "credit_card",
    };
  }

  private parseLine(line: string): TransactionData | null {
    const fields = this.parseCSVLine(line);
    if (fields.length < 11) return null;

    const id = fields[9]?.replace(/'/g, "");
    const date = new Date(fields[0]);
    const amount = -1 * parseFloat(fields[2]);

    let merchant = fields[1];
    const extendedDetails = fields[3];

    if (merchant.startsWith("Amex Split Credit: ")) {
      const [phoneNumber, detail, description] = extendedDetails.split("\n");
      merchant = merchant.replace("Venmo-", "") + ", " + detail;
    } else {
      for (const detail of extendedDetails.split("\n")) {
        if (
          detail.substring(0, 20).trim() === merchant.substring(0, 20).trim()
        ) {
          merchant = detail;
          break;
        }
      }
    }

    const amexCategory = fields[10];
    let category: string | null = null;

    if (amexCategory && AMEX_CATEGORY_TO_MY_CATEGORY[amexCategory]) {
      category = AMEX_CATEGORY_TO_MY_CATEGORY[amexCategory];
    }

    if (!category) {
      category = tryFindCategory(merchant, CATEGORY_TO_MERCHANTS);
    }

    return {
      id,
      date,
      amount,
      merchant,
      category: category || undefined,
      note: undefined,
      custom_category: amexCategory,
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
