/*
  Warnings:

  - Added the required column `userId` to the `WorkerEducation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkerEducation" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkerEducation" ADD CONSTRAINT "WorkerEducation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
