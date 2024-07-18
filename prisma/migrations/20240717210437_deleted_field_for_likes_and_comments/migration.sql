-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "deleted" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "deleted" TIMESTAMP(3);
