import {
  ParserResult,
  CSVParser,
  TransactionData,
  tryFindCategory,
  CATEGORY_TO_MERCHANTS,
} from "../import-utils";
import { parseCSVData } from "../csv-utils";

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
        console.warn(`Error parsing Amex row ${i}:`, error);
      }
    }

    return {
      transactions,
      accountName: "Amex",
      accountType: "credit_card",
    };
  }

  private parseRow(fields: string[]): TransactionData | null {
    if (fields.length < 10) return null;

    // Find the ID field - it's the field that starts with a quote and contains digits
    let id: string | undefined;
    let amexCategory: string | undefined;
    
    for (let i = 9; i < fields.length; i++) {
      const field = fields[i];
      if (field && field.startsWith("'") && field.match(/\d/)) {
        id = field.replace(/'/g, "");
        break;
      }
    }
    
    // Find the category field - it's usually the second to last field (Category Code)
    if (fields.length > 11) {
      amexCategory = fields[fields.length - 2]; // Category Code
    } else {
      amexCategory = fields[fields.length - 1]; // Fallback to last field
    }

    // Parse date in MM/DD/YYYY format using UTC to avoid timezone issues
    const [month, day, year] = fields[0].split('/');
    const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
    const amount = -1 * parseFloat(fields[2]);

    let merchant = fields[1];
    const extendedDetails = fields[3];

    if (merchant.startsWith("Amex Split Credit: ")) {
      const [phoneNumber, detail, description] = extendedDetails.split("\n");
      merchant = merchant.replace("Venmo-", "") + ", " + detail;
    } else {
      // Look for the merchant name in the extended details
      const details = extendedDetails.split("\n");
      for (const detail of details) {
        // Find a line that looks like a merchant name (not phone numbers or addresses)
        if (detail && !detail.match(/^\d/) && !detail.includes("UNITED STATES") && !detail.includes("UNITED KINGDOM") && detail.length > 5) {
          merchant = detail;
          break;
        }
      }
    }

    let category: string | null = null;

    // First try to map from Amex category code
    if (amexCategory && AMEX_CATEGORY_TO_MY_CATEGORY[amexCategory]) {
      category = AMEX_CATEGORY_TO_MY_CATEGORY[amexCategory];
    }

    // If no mapping found, try to find category from merchant name
    if (!category) {
      category = tryFindCategory(merchant, CATEGORY_TO_MERCHANTS);
    }

    // If still no category, use the category description field (last field)
    if (!category && fields.length > 10) {
      const categoryDescription = fields[fields.length - 1];
      if (categoryDescription) {
        category = categoryDescription;
      }
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

}
