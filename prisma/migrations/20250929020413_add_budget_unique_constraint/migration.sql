/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,startDate]` on the table `budgets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "budgets_categoryId_startDate_key" ON "budgets"("categoryId", "startDate");
