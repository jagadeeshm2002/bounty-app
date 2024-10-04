/*
  Warnings:

  - A unique constraint covering the columns `[issueId]` on the table `Bounty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bounty_issueId_key" ON "Bounty"("issueId");
