/*
  Warnings:

  - Added the required column `userId` to the `Time` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Time" ADD COLUMN     "userId" TEXT NOT NULL;
