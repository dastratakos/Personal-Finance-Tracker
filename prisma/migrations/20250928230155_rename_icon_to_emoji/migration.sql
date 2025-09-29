-- CreateTable
CREATE TABLE "accounts_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "categories_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categories_name_key" UNIQUE ("name")
);

-- Copy data from old tables to new tables
INSERT INTO "accounts_new" ("id", "name", "accountType", "emoji", "createdAt")
SELECT "id", "name", "accountType", "icon", "createdAt" FROM "accounts";

INSERT INTO "categories_new" ("id", "name", "emoji", "createdAt")
SELECT "id", "name", "icon", "createdAt" FROM "categories";

-- Drop old tables
DROP TABLE "accounts";
DROP TABLE "categories";

-- Rename new tables to original names
ALTER TABLE "accounts_new" RENAME TO "accounts";
ALTER TABLE "categories_new" RENAME TO "categories";

