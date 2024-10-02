/*
  Warnings:

  - The `status` column on the `Bounty` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `repoId` to the `Bounty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'CLAIMED', 'PAID');

-- AlterTable
ALTER TABLE "Bounty" ADD COLUMN     "repoId" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "htmlUrl" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
