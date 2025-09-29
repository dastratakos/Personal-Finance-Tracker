/*
  Warnings:

  - Added the required column `icon` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_categories" ("createdAt", "id", "name", "icon") 
SELECT "createdAt", "id", "name", 
  CASE 
    WHEN "name" = 'Housing' THEN '🏠'
    WHEN "name" = 'Food' THEN '🍽️'
    WHEN "name" = 'Groceries' THEN '🛒'
    WHEN "name" = 'Wellness' THEN '💚'
    WHEN "name" = 'Daily Transport' THEN '🚗'
    WHEN "name" = 'Travel' THEN '✈️'
    WHEN "name" = 'Technology' THEN '💻'
    WHEN "name" = 'Personal Care' THEN '🪥'
    WHEN "name" = 'LEGO' THEN '🧱'
    WHEN "name" = 'Clothing' THEN '👕'
    WHEN "name" = 'Gifts' THEN '🎁'
    WHEN "name" = 'Entertainment' THEN '🎬'
    WHEN "name" = 'Subscription' THEN '📱'
    WHEN "name" = 'Going Out' THEN '🍻'
    WHEN "name" = 'Transfer' THEN '🔄'
    ELSE '📂'
  END
FROM "categories";
DROP TABLE "categories";
ALTER TABLE "new_categories" RENAME TO "categories";
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
