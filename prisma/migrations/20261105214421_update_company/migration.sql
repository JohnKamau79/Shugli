/*
  Warnings:

  - Made the column `description` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `Jobs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "company" TEXT,
ALTER COLUMN "duration" SET NOT NULL;
