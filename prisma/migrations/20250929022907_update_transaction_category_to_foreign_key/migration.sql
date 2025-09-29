/*
  Warnings:

  - You are about to drop the column `category` on the `transactions` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "amount" DECIMAL NOT NULL,
    "merchant" TEXT,
    "categoryId" TEXT,
    "note" TEXT,
    "custom_category" TEXT,
    "isManual" BOOLEAN NOT NULL DEFAULT false,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importId" TEXT,
    CONSTRAINT "transactions_importId_fkey" FOREIGN KEY ("importId") REFERENCES "imports" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("accountId", "amount", "custom_category", "date", "id", "importId", "importedAt", "isManual", "merchant", "note") SELECT "accountId", "amount", "custom_category", "date", "id", "importId", "importedAt", "isManual", "merchant", "note" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
