import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
    }

    // Get the quiz to check ownership
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Check if user is the creator
    if (existingQuiz.user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, isPrivate, totalQuestions, questions, deletedQuestionIds } = body;

    // Delete removed questions
    if (deletedQuestionIds && deletedQuestionIds.length > 0) {
      await prisma.quizQuestion.deleteMany({
        where: {
          id: { in: deletedQuestionIds },
          quizId: id,
        },
      });
    }

    // Update quiz metadata
    await prisma.quiz.update({
      where: { id },
      data: {
        title,
        description,
        isPrivate,
        totalQuestions,
      },
    });

    // Process questions
    if (questions && Array.isArray(questions)) {
      for (const q of questions) {
        // Process options to string array
        const processedOptions = q.options.map((opt: string | { text: string; image?: string; useImage?: boolean }) => {
          if (typeof opt === "string") {
            return opt;
          }
          // Store as JSON string for complex options
          return JSON.stringify(opt);
        });

        if (q.id) {
          // Update existing question
          await prisma.quizQuestion.update({
            where: { id: q.id },
            data: {
              question: q.question,
              questionImage: q.questionImage || null,
              options: processedOptions,
              correctAnswer: q.correctAnswer,
            },
          });
        } else {
          // Create new question
          await prisma.quizQuestion.create({
            data: {
              quizId: id,
              question: q.question,
              questionImage: q.questionImage || null,
              options: processedOptions,
              correctAnswer: q.correctAnswer,
            },
          });
        }
      }
    }

    // Fetch updated quiz
    const updatedQuiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
        user: {
          select: { id: true, email: true },
        },
      },
    });

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}
