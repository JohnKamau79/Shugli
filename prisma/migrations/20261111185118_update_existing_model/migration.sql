/*
  Warnings:

  - You are about to drop the column `workerProfileId` on the `WorkExperience` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Languages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `WorkExperience` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_workerProfileId_fkey";

-- AlterTable
ALTER TABLE "WorkExperience" DROP COLUMN "workerProfileId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Languages_name_key" ON "Languages"("name");

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
