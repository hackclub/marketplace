-- CreateEnum
CREATE TYPE "TimeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Reigions" AS ENUM ('EVERYWHERE', 'US', 'AU', 'IN', 'EU', 'CA', 'UK');

-- CreateEnum
CREATE TYPE "StatusString" AS ENUM ('DRAFT', 'UNDER_HQ_DIGITAL_REVIEW', 'UNDER_HQ_GRANT_REVIEW', 'UNDER_HQ_REVIEW', 'SHIPPED');

-- CreateTable
CREATE TABLE "User" (
    "slackId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "currency" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "hcb_email" TEXT,
    "reigions_for_shipping" "Reigions",
    "slack_id" TEXT NOT NULL,
    "slack_name" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("slackId")
);

-- CreateTable
CREATE TABLE "Ship" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Reviewer" TEXT,
    "grant_amount" DOUBLE PRECISION NOT NULL DEFAULT 30.0,
    "requested_grant_amount" DOUBLE PRECISION NOT NULL,
    "status" "StatusString" NOT NULL DEFAULT 'DRAFT',
    "approved_for_grant" BOOLEAN NOT NULL DEFAULT false,
    "approved_for_hq" BOOLEAN NOT NULL DEFAULT false,
    "approved_for_digital" BOOLEAN NOT NULL DEFAULT false,
    "github_url" TEXT NOT NULL,
    "demo_url" TEXT,
    "cover_image_url" TEXT NOT NULL DEFAULT 'https://hc-cdn.hel1.your-objectstorage.com/s/v3/113006acabca1ebbaadb96594f5905aa250dccca_9b1f3503271d6474.png',
    "readme_url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "reviewer_feedback" TEXT,
    "slack_user_name" TEXT NOT NULL,
    "total_time_in_seconds" TEXT,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,

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

-- CreateTable
CREATE TABLE "Time" (
    "id" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "video_link" TEXT,
    "status" "TimeStatus" NOT NULL DEFAULT 'PENDING',
    "total_time_in_seconds" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "memo" TEXT,
    "wormhole_link" TEXT,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_slackId_slack_name_key" ON "User"("slackId", "slack_name");

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_userId_slack_user_name_fkey" FOREIGN KEY ("userId", "slack_user_name") REFERENCES "User"("slackId", "slack_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("slackId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeidiEscrow" ADD CONSTRAINT "HeidiEscrow_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeidiEscrow" ADD CONSTRAINT "HeidiEscrow_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeidiEscrow" ADD CONSTRAINT "HeidiEscrow_userSlackId_fkey" FOREIGN KEY ("userSlackId") REFERENCES "User"("slackId") ON DELETE SET NULL ON UPDATE CASCADE;
