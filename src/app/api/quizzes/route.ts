import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: { questions: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Błąd pobierania quizów:", error);
    return NextResponse.json({ error: "Nie udało się pobrać quizów" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const quiz = await prisma.quiz.create({
      data: {
        title: data.title,
        userId: data.userId,
        noteId: data.noteId || null,
        totalQuestions: data.totalQuestions || 0,
        questions: {
          create: data.questions?.map((q: any) => ({
            question: q.question,
            correctAnswer: q.correctAnswer,
            options: q.options,
          })),
        },
      },
      include: { questions: true },
    });
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Błąd tworzenia quizu:", error);
    return NextResponse.json({ error: "Nie udało się utworzyć quizu" }, { status: 500 });
  }
}
