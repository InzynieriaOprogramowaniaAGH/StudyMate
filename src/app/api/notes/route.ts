import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

<<<<<<< HEAD

=======
>>>>>>> 706aa7d057557567126f31231858642e5d5cf938
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
<<<<<<< HEAD
      take: 10, 
=======
      take: 10,
>>>>>>> 706aa7d057557567126f31231858642e5d5cf938
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Błąd pobierania notatek:", error);
    return NextResponse.json({ error: "Nie udało się pobrać notatek" }, { status: 500 });
  }
}

<<<<<<< HEAD
=======

>>>>>>> 706aa7d057557567126f31231858642e5d5cf938
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
