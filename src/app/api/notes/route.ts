import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// pobiera wszystkie notatki z bazy
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
      take: 10, // np. ostatnie 10 notatek
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Błąd pobierania notatek:", error);
    return NextResponse.json({ error: "Nie udało się pobrać notatek" }, { status: 500 });
  }
}

// tworzy nową notatkę
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newNote = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        userId: body.userId, // tymczasowo ręcznie
      },
    });

    return NextResponse.json(newNote);
  } catch (error) {
    console.error("Błąd tworzenia notatki:", error);
    return NextResponse.json({ error: "Nie udało się utworzyć notatki" }, { status: 500 });
  }
}
