import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
      take: 10, 
      take: 10,
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Błąd pobierania notatek:", error);
    return NextResponse.json({ error: "Nie udało się pobrać notatek" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newNote = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        userId: body.userId,
      },
    });

    return NextResponse.json(newNote);
  } catch (error) {
    console.error("Błąd tworzenia notatki:", error);
    return NextResponse.json({ error: "Nie udało się utworzyć notatki" }, { status: 500 });
  }
}
