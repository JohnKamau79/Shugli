-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_jobId_fkey";

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
