-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'owner', 'admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
