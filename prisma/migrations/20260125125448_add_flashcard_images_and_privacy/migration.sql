-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "backImage" TEXT,
ADD COLUMN     "frontImage" TEXT,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT true;
