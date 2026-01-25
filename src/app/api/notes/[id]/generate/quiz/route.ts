import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAIProvider, getAllAvailableProviders } from "@/lib/ai";

export const runtime = "nodejs";

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

    // Save quiz to database
    const created = await prisma.quiz.create({
      data: {
        title: result.title,
        description: result.description || note.description || null,
        isPrivate: note.isPrivate,
        userId: note.user.id,
        noteId: note.id,
        totalQuestions: result.questions.length,
        questions: {
          create: result.questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.options[q.correctAnswerIndex] || q.options[0],
          })),
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
