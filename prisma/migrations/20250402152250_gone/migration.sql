/*
  Warnings:

  - You are about to drop the `CacheObject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `slack_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slack_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Reigions" AS ENUM ('EVERYWHERE', 'US', 'AU', 'IN', 'EU', 'CA', 'UK');

-- CreateEnum
CREATE TYPE "StatusString" AS ENUM ('DRAFT', 'UNDER_HQ_DIGITAL_REVIEW', 'UNDER_HQ_GRANT_REVIEW', 'UNDER_HQ_REVIEW', 'SHIPPED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currency" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "hcb_email" TEXT,
ADD COLUMN     "reigions_for_shipping" "Reigions",
ADD COLUMN     "slack_id" TEXT NOT NULL,
ADD COLUMN     "slack_name" TEXT NOT NULL;

-- DropTable
DROP TABLE "CacheObject";

-- CreateTable
CREATE TABLE "Ship" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Reviewer" TEXT,
    "owner" TEXT NOT NULL,
    "grant_amount" DOUBLE PRECISION NOT NULL DEFAULT 30.0,
    "requested_grant_amount" DOUBLE PRECISION NOT NULL,
    "status" "StatusString" NOT NULL DEFAULT 'DRAFT',
    "approved_for_grant" BOOLEAN NOT NULL DEFAULT false,
    "approved_for_hq" BOOLEAN NOT NULL DEFAULT false,
    "approved_for_digital" BOOLEAN NOT NULL DEFAULT false,
    "github_url" TEXT NOT NULL,
    "demo_url" TEXT NOT NULL,
    "cover_image_url" TEXT NOT NULL DEFAULT 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/113006acabca1ebbaadb96594f5905aa250dccca_9b1f3503271d6474.png',
    "readme_url" TEXT NOT NULL,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeidiEscrow" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "userSlackId" TEXT,
    "shipId" TEXT,

    CONSTRAINT "HeidiEscrow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("slackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeidiEscrow" ADD CONSTRAINT "HeidiEscrow_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeidiEscrow" ADD CONSTRAINT "HeidiEscrow_userSlackId_fkey" FOREIGN KEY ("userSlackId") REFERENCES "User"("slackId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeidiEscrow" ADD CONSTRAINT "HeidiEscrow_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
