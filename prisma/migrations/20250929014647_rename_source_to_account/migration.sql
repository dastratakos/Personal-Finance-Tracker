/*
  Warnings:

  - You are about to drop the column `source` on the `imports` table. All the data in the column will be lost.
  - Added the required column `account` to the `imports` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_imports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_imports" ("checksum", "filename", "id", "importedAt") SELECT "checksum", "filename", "id", "importedAt" FROM "imports";
DROP TABLE "imports";
ALTER TABLE "new_imports" RENAME TO "imports";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
