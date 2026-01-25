-- Add timesReviewed column to Flashcard for tracking review count
ALTER TABLE "Flashcard" ADD COLUMN "timesReviewed" INTEGER NOT NULL DEFAULT 0;
