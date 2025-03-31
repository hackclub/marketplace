-- DropIndex
DROP INDEX "CacheObject_key_key";

-- AlterTable
ALTER TABLE "CacheObject" ALTER COLUMN "ttl" SET DEFAULT NOW() + interval '1 hour';
