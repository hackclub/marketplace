/*
  Warnings:

  - You are about to drop the column `userId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseId` on the `Time` table. All the data in the column will be lost.
  - You are about to drop the column `airtable_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slackId,slack_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buyerId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slack_user_name` to the `Ship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Time` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ship" DROP CONSTRAINT "Ship_userId_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_purchaseId_fkey";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "userId",
ADD COLUMN     "buyerId" TEXT NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ship" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewer_feedback" TEXT,
ADD COLUMN     "slack_user_name" TEXT NOT NULL,
ALTER COLUMN "demo_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Time" DROP COLUMN "purchaseId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "video_link" DROP NOT NULL,
ALTER COLUMN "total_time_in_seconds" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "airtable_id",
ADD COLUMN     "address" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_slackId_slack_name_key" ON "User"("slackId", "slack_name");

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_userId_slack_user_name_fkey" FOREIGN KEY ("userId", "slack_user_name") REFERENCES "User"("slackId", "slack_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("slackId") ON DELETE RESTRICT ON UPDATE CASCADE;
