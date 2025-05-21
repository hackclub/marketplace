-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'SENT', 'ARRIVED', 'CANCELLED', 'REJECTED');

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "status" "PaymentStatus" DEFAULT 'PENDING';
