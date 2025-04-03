/*
  Warnings:

  - You are about to drop the column `owner` on the `Ship` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Ship` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TimeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Ship" DROP COLUMN "owner",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Time" (
    "id" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "purchaseId" TEXT,
    "video_link" TEXT NOT NULL,
    "status" "TimeStatus" NOT NULL DEFAULT 'PENDING',
    "total_time_in_seconds" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("slackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
