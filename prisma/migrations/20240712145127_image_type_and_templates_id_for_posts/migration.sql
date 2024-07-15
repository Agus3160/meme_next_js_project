/*
  Warnings:

  - A unique constraint covering the columns `[templateId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageType` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "imageType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "templateId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_templateId_key" ON "Post"("templateId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
