/*
  Warnings:

  - Made the column `company` on table `Jobs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Jobs" ALTER COLUMN "company" SET NOT NULL;

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" SERIAL NOT NULL,
    "workerProfileId" INTEGER NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "doEntry" TIMESTAMP(3) NOT NULL,
    "doExit" TIMESTAMP(3) NOT NULL,
    "cityId" INTEGER NOT NULL,
    "skills" TEXT[],
    "achievements" TEXT[],

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerEducation" (
    "id" SERIAL NOT NULL,
    "institute" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "doEntry" TIMESTAMP(3) NOT NULL,
    "doExit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Languages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Languages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_workerProfileId_fkey" FOREIGN KEY ("workerProfileId") REFERENCES "WorkerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
