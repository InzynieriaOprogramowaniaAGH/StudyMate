/*
  Warnings:

  - You are about to drop the column `summary` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `accuracy` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `notesStudied` on the `Progress` table. All the data in the column will be lost.
  - You are about to alter the column `score` on the `Quiz` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `answer` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `QuizQuestion` table. All the data in the column will be lost.
  - Added the required column `correctAnswer` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "summary";

-- AlterTable
ALTER TABLE "Progress" DROP COLUMN "accuracy",
DROP COLUMN "notesStudied",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notesCreated" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "totalQuestions" INTEGER,
ALTER COLUMN "score" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "answer",
DROP COLUMN "correct",
ADD COLUMN     "correctAnswer" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
