/*
  Warnings:

  - Made the column `level` on table `WorkerEducation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WorkerEducation" ALTER COLUMN "level" SET NOT NULL;
