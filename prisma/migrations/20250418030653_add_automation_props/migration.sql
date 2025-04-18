-- AlterTable
ALTER TABLE "Ship" ADD COLUMN     "automation_approved_for_digital" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "automation_approved_for_grant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "automation_approved_for_hq" BOOLEAN NOT NULL DEFAULT false;
