-- Add missing SRS columns for flashcards
ALTER TABLE "Flashcard" ADD COLUMN IF NOT EXISTS "lastReviewedAt" TIMESTAMP(3);
ALTER TABLE "Flashcard" ADD COLUMN IF NOT EXISTS "nextReview" TIMESTAMP(3);
ALTER TABLE "Flashcard" ADD COLUMN IF NOT EXISTS "easeFactor" DOUBLE PRECISION;
