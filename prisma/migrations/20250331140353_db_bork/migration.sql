/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `CacheObject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `CacheObject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CacheObject" ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "ttl" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '1 hour';

-- CreateIndex
CREATE UNIQUE INDEX "CacheObject_key_key" ON "CacheObject"("key");
