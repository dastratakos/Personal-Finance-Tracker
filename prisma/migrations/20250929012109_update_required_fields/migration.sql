/*
  Warnings:

  - Made the column `accountType` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `icon` on table `accounts` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_accounts" ("accountType", "createdAt", "icon", "id", "name") SELECT "accountType", "createdAt", "icon", "id", "name" FROM "accounts";
DROP TABLE "accounts";
ALTER TABLE "new_accounts" RENAME TO "accounts";
CREATE TABLE "new_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "amount" DECIMAL NOT NULL,
    "merchant" TEXT,
    "category" TEXT,
    "note" TEXT,
    "custom_category" TEXT,
    "isManual" BOOLEAN NOT NULL DEFAULT false,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importId" TEXT,
    CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_importId_fkey" FOREIGN KEY ("importId") REFERENCES "imports" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("accountId", "amount", "category", "custom_category", "date", "id", "importId", "importedAt", "isManual", "merchant", "note") SELECT "accountId", "amount", "category", "custom_category", "date", "id", "importId", "importedAt", "isManual", "merchant", "note" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
