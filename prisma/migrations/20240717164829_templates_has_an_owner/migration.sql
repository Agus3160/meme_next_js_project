/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `Template` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Post_templateId_key";

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Template_authorId_key" ON "Template"("authorId");

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
