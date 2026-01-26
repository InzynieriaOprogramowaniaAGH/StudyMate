import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAIProvider, getAllAvailableProviders } from "@/lib/ai";

export const runtime = "nodejs";

function shuffleOptions(options: string[], correctAnswerIndex: number): {
  shuffledOptions: string[];
  newCorrectIndex: number;
} {
  const correct = options[correctAnswerIndex];
  const shuffled = [...options];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return {
    shuffledOptions: shuffled,
    newCorrectIndex: Math.max(0, shuffled.indexOf(correct)),
  };
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: noteId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { user: { select: { id: true, email: true } } },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.user.email !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all available AI providers for fallback
    const providers = getAllAvailableProviders();
    
    if (providers.length === 0) {
      return NextResponse.json(
        { error: "No AI provider available. Please configure at least one API key." },
        { status: 503 }
      );
    }

    // Try each provider until one succeeds
    let result;
    let lastError;
    
    for (const provider of providers) {
      try {
        result = await provider.generateQuiz({
          noteTitle: note.title,
          noteSubject: note.subject ?? undefined,
          noteDescription: note.description ?? undefined,
          noteContent: note.content,
        });
        break; // Success!
      } catch (error: any) {
        lastError = error;
        // If rate limited, try next provider
        if (error?.status === 429 || error?.message?.includes("429")) {
          console.warn(`Provider rate limited, trying next provider...`);
          continue;
        }
        // For other errors, don't try other providers
        throw error;
      }
    }
    
    if (!result) {
      throw lastError || new Error("All providers failed");
    }

    if (!result.questions.length) {
      return NextResponse.json({ error: "No quiz generated" }, { status: 400 });
    }

    // Shuffle options per question to randomize correct answer position
    const shuffledQuestions = result.questions.map((q) => {
      const { shuffledOptions, newCorrectIndex } = shuffleOptions(
        q.options,
        q.correctAnswerIndex
      );
      return {
        question: q.question,
        options: shuffledOptions,
        correctAnswer: shuffledOptions[newCorrectIndex] || shuffledOptions[0],
      };
    });

    // Save quiz to database
    const created = await prisma.quiz.create({
      data: {
        title: result.title,
        description: result.description || note.description || null,
        isPrivate: note.isPrivate,
        userId: note.user.id,
        noteId: note.id,
        totalQuestions: shuffledQuestions.length,
        questions: {
          create: shuffledQuestions,
        },
      },
      include: { questions: true },
    });

    return NextResponse.json({ id: created.id });
  } catch (error) {
    console.error("Error generating quiz:", error);
    const message = error instanceof Error ? error.message : "Failed to generate quiz";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
