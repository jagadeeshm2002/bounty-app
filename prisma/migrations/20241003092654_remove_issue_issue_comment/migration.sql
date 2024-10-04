/*
  Warnings:

  - You are about to drop the column `commentId` on the `Bounty` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Bounty` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the `Issue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IssueComment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `issueCommentBody` to the `Bounty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueCommentId` to the `Bounty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueComment_url` to the `Bounty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issue_url` to the `Bounty` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bounty" DROP CONSTRAINT "Bounty_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Bounty" DROP CONSTRAINT "Bounty_issueId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_userId_fkey";

-- DropForeignKey
ALTER TABLE "IssueComment" DROP CONSTRAINT "IssueComment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "IssueComment" DROP CONSTRAINT "IssueComment_userId_fkey";

-- DropIndex
DROP INDEX "Bounty_commentId_key";

-- AlterTable
ALTER TABLE "Bounty" DROP COLUMN "commentId",
ADD COLUMN     "issueCommentBody" TEXT NOT NULL,
ADD COLUMN     "issueCommentId" TEXT NOT NULL,
ADD COLUMN     "issueComment_url" TEXT NOT NULL,
ADD COLUMN     "issue_url" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "issueId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Issue";

-- DropTable
DROP TABLE "IssueComment";
