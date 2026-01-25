-- Ensure flashcard set grouping columns exist
ALTER TABLE "Flashcard" ADD COLUMN IF NOT EXISTS "setTitle" TEXT;
ALTER TABLE "Flashcard" ADD COLUMN IF NOT EXISTS "setDescription" TEXT;
ALTER TABLE "Flashcard" ADD COLUMN IF NOT EXISTS "setId" TEXT;
