-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "githubId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "IssueComment" ALTER COLUMN "githubId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Repository" ALTER COLUMN "githubId" SET DATA TYPE TEXT;
