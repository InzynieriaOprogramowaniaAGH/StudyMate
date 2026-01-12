import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // upewniamy się, że notatka należy do usera
    const note = await prisma.note.findFirst({
      where: { id: params.id, userId: user.id },
      select: { id: true },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const flashcards = await prisma.flashcard.findMany({
      where: { noteId: params.id, userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ noteId: params.id, count: flashcards.length, flashcards });
  } catch (err: any) {
    console.error("[note flashcards GET] error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch flashcards" },
      { status: 500 }
    );
  }
}
