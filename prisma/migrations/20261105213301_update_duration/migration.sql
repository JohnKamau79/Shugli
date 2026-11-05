-- CreateEnum
CREATE TYPE "Duration" AS ENUM ('Full_Time', 'Contract', 'Part_Time', 'Internship', 'Cashual');

-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "duration" "Duration";
