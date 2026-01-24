import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email;

    // Find current user if logged in
    let currentUserId: string | null = null;
    if (currentUserEmail) {
      const user = await prisma.user.findUnique({
        where: { email: currentUserEmail },
        select: { id: true }
      });
      currentUserId = user?.id || null;
    }

    // Only show public quizzes OR user's own private quizzes
    const quizzes = await prisma.quiz.findMany({
      where: {
        OR: [
          { isPrivate: false },
          ...(currentUserId ? [{ userId: currentUserId }] : [])
        ]
      },
      include: { 
        questions: true,
        user: {
          select: { id: true, email: true }
        }
      },
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
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await req.json();
    const { title, description, isPrivate, totalQuestions, questions } = data;

    if (!title || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Title and questions are required" },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description || null,
        isPrivate: isPrivate ?? true,
        userId: user.id,
        noteId: data.noteId || null,
        totalQuestions: questions.length,
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            questionImage: q.questionImage || null,
            correctAnswer: q.correctAnswer,
            options: q.options.map((opt: any) => {
              // If option is an object with text and image, store as JSON
              if (typeof opt === 'object' && (opt.text || opt.image)) {
                return JSON.stringify({ text: opt.text || '', image: opt.image });
              }
              // If it's a string, keep as is
              return opt;
            }),
          })),
        },
      },
      include: { questions: true },
    });
    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Błąd tworzenia quizu:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Nie udało się utworzyć quizu: ${errorMessage}` },
      { status: 500 }
    );
  }
}
