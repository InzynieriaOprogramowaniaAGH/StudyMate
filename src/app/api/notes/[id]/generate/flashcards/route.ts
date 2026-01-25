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
        result = await provider.generateFlashcards({
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

    if (!result.cards.length) {
      return NextResponse.json({ error: "No flashcards generated" }, { status: 400 });
    }

    // Save flashcards to database
    await prisma.flashcard.createMany({
      data: result.cards.map((card) => ({
        front: card.front,
        back: card.back,
        userId: note.user.id,
        noteId: note.id,
        setTitle: note.title,
        setDescription: note.description || null,
        isPrivate: note.isPrivate,
      })),
    });

    return NextResponse.json({ created: result.cards.length });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    const message = error instanceof Error ? error.message : "Failed to generate flashcards";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
