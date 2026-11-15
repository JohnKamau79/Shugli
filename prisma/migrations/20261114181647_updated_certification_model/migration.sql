/*
  Warnings:

  - Added the required column `issueDate` to the `Certification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certification" ADD COLUMN     "issueDate" TIMESTAMP(3) NOT NULL;
