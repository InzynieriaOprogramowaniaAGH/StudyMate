import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// pobiera wszystkie notatki z bazy
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

    // Only show public notes OR user's own notes (both public and private)
    const notes = await prisma.note.findMany({
      where: {
        OR: [
          { isPrivate: false },
          ...(currentUserId ? [{ userId: currentUserId }] : [])
        ]
      },
      include: {
        user: {
          select: { id: true, email: true }
        }
      },
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
    const session = await getServerSession(authOptions);

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
    const { title, subject, description, content, isPrivate } = body;

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
        isPrivate: isPrivate ?? true,
      },
    });

    // Record stats for note creation
    await prisma.stats.create({
      data: {
        userId: user.id,
        action: "noteAdded",
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
