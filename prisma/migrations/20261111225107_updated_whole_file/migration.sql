/*
  Warnings:

  - The values [Cashual] on the enum `Duration` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ProfessionalSummary` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Duration_new" AS ENUM ('Full_Time', 'Contract', 'Part_Time', 'Internship', 'Casual');
ALTER TABLE "Jobs" ALTER COLUMN "duration" TYPE "Duration_new" USING ("duration"::text::"Duration_new");
ALTER TYPE "Duration" RENAME TO "Duration_old";
ALTER TYPE "Duration_new" RENAME TO "Duration";
DROP TYPE "public"."Duration_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- DropForeignKey
ALTER TABLE "Jobs" DROP CONSTRAINT "Jobs_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProfessionalSummary" DROP CONSTRAINT "ProfessionalSummary_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkerEducation" DROP CONSTRAINT "WorkerEducation_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkerProfile" DROP CONSTRAINT "WorkerProfile_userId_fkey";

-- AlterTable
ALTER TABLE "WorkExperience" ALTER COLUMN "doExit" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WorkerEducation" ALTER COLUMN "doExit" DROP NOT NULL;

-- DropTable
DROP TABLE "ProfessionalSummary";

-- CreateTable
CREATE TABLE "_LanguagesToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LanguagesToUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LanguagesToUsers_B_index" ON "_LanguagesToUsers"("B");

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerProfile" ADD CONSTRAINT "WorkerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerEducation" ADD CONSTRAINT "WorkerEducation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguagesToUsers" ADD CONSTRAINT "_LanguagesToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguagesToUsers" ADD CONSTRAINT "_LanguagesToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
