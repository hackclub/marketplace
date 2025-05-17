-- AlterTable
ALTER TABLE "Time" ADD COLUMN     "pauseHistory" JSONB DEFAULT '[]',
ADD COLUMN     "pausedAt" TIMESTAMP(3);
