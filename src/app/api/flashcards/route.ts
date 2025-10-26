import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // upewnij się, że masz plik prisma.ts w /lib/

// pobiera listę fiszek
export async function GET() {
  try {
    const flashcards = await prisma.flashcard.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Błąd pobierania fiszek:", error);
    return NextResponse.json({ error: "Nie udało się pobrać fiszek" }, { status: 500 });
  }
}

// dodaje nową fiszkę
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newFlashcard = await prisma.flashcard.create({
      data: {
        front: data.front,
        back: data.back,
        userId: data.userId,
        noteId: data.noteId || null,
      },
    });

    return NextResponse.json(newFlashcard);
  } catch (error) {
    console.error("Błąd tworzenia fiszki:", error);
    return NextResponse.json({ error: "Nie udało się utworzyć fiszki" }, { status: 500 });
  }
}
