import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// pobiera wszystkie notatki z bazy
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const notes = await prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Błąd pobierania notatek:", error);
    return NextResponse.json(
      { error: "Nie udało się pobrać notatek" },
      { status: 500 }
    );
  }
}

// tworzy nową notatkę
export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, subject, description, content } = body;

    if (!title || !subject || !description || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        subject,
        description,
        userId: user.id,
      },
    });

    return NextResponse.json(newNote);
  } catch (error) {
    console.error("Błąd tworzenia notatki:", error);
    return NextResponse.json(
      { error: "Nie udało się utworzyć notatki" },
      { status: 500 }
    );
  }
}
