-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('Certificate', 'Diploma', 'Bachelors_BSc_BA', 'Masters_MSc_MA', 'Doctorate_PHD');

-- AlterTable
ALTER TABLE "WorkerEducation" ADD COLUMN     "level" "EducationLevel";

-- CreateTable
CREATE TABLE "ProfessionalSummary" (
    "id" SERIAL NOT NULL,
    "summary" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProfessionalSummary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfessionalSummary" ADD CONSTRAINT "ProfessionalSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
