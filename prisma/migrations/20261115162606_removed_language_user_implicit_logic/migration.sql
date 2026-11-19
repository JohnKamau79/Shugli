/*
  Warnings:

  - You are about to drop the `_LanguagesToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LanguagesToUsers" DROP CONSTRAINT "_LanguagesToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_LanguagesToUsers" DROP CONSTRAINT "_LanguagesToUsers_B_fkey";

-- DropTable
DROP TABLE "_LanguagesToUsers";
