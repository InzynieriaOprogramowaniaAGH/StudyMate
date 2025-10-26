import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const progress = await prisma.progress.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(progress);
  } catch (error) {
    console.error("Błąd pobierania postępu:", error);
    return NextResponse.json({ error: "Nie udało się pobrać postępu" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const updated = await prisma.progress.update({
      where: { id: data.id },
      data: {
        quizzesTaken: data.quizzesTaken,
        flashcardsReviewed: data.flashcardsReviewed,
        notesCreated: data.notesCreated,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Błąd aktualizacji postępu:", error);
    return NextResponse.json({ error: "Nie udało się zaktualizować postępu" }, { status: 500 });
  }
}
