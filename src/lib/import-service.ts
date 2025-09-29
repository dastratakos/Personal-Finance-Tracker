import { ImportService } from "./import-utils";
import { ImportResult } from "@/types";
import { PrismaClient } from "@prisma/client";
import {
  AmexParser,
  WellsFargoParser,
  VenmoParser,
  TargetParser,
  CITParser,
  BiltParser,
} from "./parsers";

export class ImportCoordinator {
  private importService: ImportService;
  private parsers: Map<string, any>;

  constructor(prisma: PrismaClient) {
    this.importService = new ImportService(prisma);
    this.parsers = new Map<string, any>([
      ["Amex", new AmexParser()],
      ["Wells Fargo", new WellsFargoParser()],
      ["Venmo", new VenmoParser()],
      ["Target", new TargetParser()],
      ["CIT", new CITParser()],
      ["Bilt", new BiltParser()],
    ]);
  }

  async importCSV(filename: string, csvContent: string): Promise<ImportResult> {
    try {
      // Detect account from filename
      const accountName = this.importService.detectAccount(filename);

      // Calculate checksum for deduplication
      const checksum = this.importService.calculateChecksum(csvContent);

      // Check if already imported
      const alreadyImported = await this.importService.checkExistingImport(
        filename,
        checksum
      );
      if (alreadyImported) {
        return {
          success: false,
          message: "This file has already been imported.",
          importedCount: 0,
          duplicateCount: 0,
        };
      }

      // Get parser for account
      const parser = this.parsers.get(accountName);
      if (!parser) {
        return {
          success: false,
          message: `No parser available for account: ${accountName}`,
          importedCount: 0,
          duplicateCount: 0,
        };
      }

      // Parse CSV content
      const parseResult = parser.parse(csvContent, filename);

      // Get or create account
      const accountId = await this.importService.getOrCreateAccount(
        parseResult.accountName,
        parseResult.accountType
      );

      // Create import record
      const importId = await this.importService.createImport(
        filename,
        checksum,
        accountId
      );

      // Process transactions
      const { importedCount, duplicateCount } =
        await this.importService.processTransactions(
          parseResult.transactions,
          accountId,
          importId
        );

      return {
        success: true,
        message: `Successfully imported ${importedCount} transactions. ${duplicateCount} duplicates skipped.`,
        importedCount,
        duplicateCount,
        importId,
      };
    } catch (error) {
      console.error("Import error:", error);
      return {
        success: false,
        message: `Import failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        importedCount: 0,
        duplicateCount: 0,
      };
    }
  }
}
