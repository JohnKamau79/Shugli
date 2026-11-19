-- CreateEnum
CREATE TYPE "LanguageLevel" AS ENUM ('Conversational', 'Intermediate', 'Fluent');

-- CreateTable
CREATE TABLE "UserLanguages" (
    "id" SERIAL NOT NULL,
    "level" "LanguageLevel" NOT NULL,
    "langId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserLanguages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLanguages_userId_langId_key" ON "UserLanguages"("userId", "langId");

-- AddForeignKey
ALTER TABLE "UserLanguages" ADD CONSTRAINT "UserLanguages_langId_fkey" FOREIGN KEY ("langId") REFERENCES "Languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLanguages" ADD CONSTRAINT "UserLanguages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
