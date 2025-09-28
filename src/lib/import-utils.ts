import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

export interface TransactionData {
  id?: string;
  date: Date;
  amount: number;
  merchant?: string;
  category?: string;
  note?: string;
  custom_category?: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  duplicateCount: number;
  importId?: string;
}

export interface ParserResult {
  transactions: TransactionData[];
  accountName: string;
  accountType?: string;
}

export interface CSVParser {
  parse(csvContent: string, filename: string): ParserResult;
}

export class ImportService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Detect source from filename pattern
   */
  detectSource(filename: string): string {
    if (filename.includes("Amex Gold")) {
      return "Amex";
    } else if (filename.includes("Wells Fargo")) {
      return "Wells Fargo";
    } else if (filename.includes("Venmo")) {
      return "Venmo";
    } else if (filename.includes("Vanguard")) {
      return "Vanguard";
    } else if (filename.includes("Target")) {
      return "Target";
    } else if (filename.includes("CIT")) {
      return "CIT";
    } else if (filename.includes("Bilt")) {
      return "Bilt";
    }

    return "Unknown";
  }

  /**
   * Calculate file checksum for deduplication
   */
  calculateChecksum(content: string): string {
    return createHash("md5").update(content).digest("hex");
  }

  /**
   * Check if import already exists
   */
  async checkExistingImport(
    filename: string,
    checksum: string
  ): Promise<boolean> {
    const existing = await this.prisma.import.findFirst({
      where: {
        filename,
        checksum,
      },
    });
    return !!existing;
  }

  /**
   * Create import record
   */
  async createImport(
    filename: string,
    checksum: string,
    source: string
  ): Promise<string> {
    const importRecord = await this.prisma.import.create({
      data: {
        filename,
        checksum,
        source,
      },
    });
    return importRecord.id;
  }

  /**
   * Get or create account
   */
  async getOrCreateAccount(
    name: string,
    accountType?: string
  ): Promise<string> {
    let account = await this.prisma.account.findFirst({
      where: { name },
    });

    if (!account) {
      account = await this.prisma.account.create({
        data: {
          name,
          accountType,
        },
      });
    }

    return account.id;
  }

  /**
   * Process transactions with idempotent logic
   */
  async processTransactions(
    transactions: TransactionData[],
    accountId: string,
    importId: string
  ): Promise<{ importedCount: number; duplicateCount: number }> {
    let importedCount = 0;
    let duplicateCount = 0;

    for (const transaction of transactions) {
      const transactionId =
        transaction.id || this.generateTransactionId(transaction);

      // Check if transaction already exists
      const existing = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
      });

      if (existing) {
        // Update only if not manually edited
        if (!existing.isManual) {
          await this.prisma.transaction.update({
            where: { id: transactionId },
            data: {
              date: transaction.date,
              amount: transaction.amount,
              merchant: transaction.merchant,
              // Only update category/note if they're currently null
              category: existing.category || transaction.category,
              note: existing.note || transaction.note,
              custom_category: transaction.custom_category,
            },
          });
        }
        duplicateCount++;
      } else {
        // Create new transaction
        await this.prisma.transaction.create({
          data: {
            id: transactionId,
            accountId,
            date: transaction.date,
            amount: transaction.amount,
            merchant: transaction.merchant,
            category: transaction.category,
            note: transaction.note,
            custom_category: transaction.custom_category,
            importId,
          },
        });
        importedCount++;
      }
    }

    return { importedCount, duplicateCount };
  }

  /**
   * Generate transaction ID from transaction data
   */
  private generateTransactionId(transaction: TransactionData): string {
    const key = `${transaction.date.toISOString()}-${transaction.amount}-${
      transaction.merchant
    }`;
    return createHash("md5").update(key).digest("hex");
  }
}

/**
 * Category mapping utilities
 */
export const CATEGORY_TO_MERCHANTS: Record<string, string[]> = {
  "Daily Transport": [
    "NYCT PAYGO",
    "NYC-TAXI",
    "TFL CHARGE",
    "UBER",
    "LYFT",
    "CALTRAIN",
    "MTA*NYCT PAYGO NEW YORK NY",
  ],
  Food: [
    "GNOCCHI ON 9TH",
    "GRUBHUB",
    "SHAREBITE",
    "SAN MARZANO",
    "BLANK STREET",
    "BOND STREET",
    "CHIPOTLE",
    "ELECTRIC BURRITO",
    "LA COLOMBE",
    "POPUPBAGELS",
    "RUBYS",
    "SWEETGREEN",
    "TEMAKASE",
    "VAN LEEUWEN ICE CREAM",
  ],
  "Going Out": ["ASTOR WINE", "ASTOR WINES & SPIRITS"],
  Groceries: ["BOOTS", "SAINSBURY", "WEGMANS", "TRADER JOE"],
  Entertainment: ["AMC"],
  LEGO: ["LEGO"],
  "Personal Care": ["HOMESICKCANDLES"],
  Subscription: ["Amazon Prime", "BARRON"],
  Technology: ["APPLE.COM/BILL"],
  Transfer: [
    "AUTOPAY PAYMENT - THANK YOU",
    "AUTOMATIC PAYMENT - THANK YOU",
    "AUTO PAYMENT",
    "AMEX EPAYMENT ACH PMT",
    "BILTPYMTS RENT PMT",
    "WF Credit Card AUTO PAY",
  ],
};

/**
 * Try to find category from merchant name
 */
export function tryFindCategory(
  merchant: string,
  categoryToMerchants: Record<string, string[]>
): string | null {
  if (!merchant) return null;

  const lowerMerchant = merchant.toLowerCase();

  for (const [category, merchants] of Object.entries(categoryToMerchants)) {
    for (const merchantPattern of merchants) {
      if (lowerMerchant.includes(merchantPattern.toLowerCase())) {
        return category;
      }
    }
  }

  return null;
}

/**
 * Remove characters from string
 */
export function removeChars(str: string, chars: string): string {
  return str
    .split("")
    .filter((char) => !chars.includes(char))
    .join("");
}
