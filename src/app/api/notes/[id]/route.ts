import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true }
        },
        quizzes: {
          select: {
            id: true,
            score: true,
            totalQuestions: true,
          }
        },
        flashcards: {
          select: {
            id: true,
            timesReviewed: true,
          }
        }
      }
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if note is private and user is not the owner
    if (note.isPrivate) {
      const currentUserEmail = session?.user?.email;
      
      if (!currentUserEmail || note.user?.email !== currentUserEmail) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
    }

    // Calculate statistics
    const quizCount = note.quizzes.length;
    const flashcardCount = note.flashcards.length;
    
    // Calculate average quiz score
    const quizzesWithScores = note.quizzes.filter(q => q.score !== null);
    const avgQuizScore = quizzesWithScores.length > 0
      ? Math.round(quizzesWithScores.reduce((sum, q) => sum + (q.score || 0), 0) / quizzesWithScores.length)
      : null;
    
    // Calculate total questions across all quizzes
    const totalQuestions = note.quizzes.reduce((sum, q) => sum + (q.totalQuestions || 0), 0);

    // Calculate total times flashcards were reviewed
    const totalTimesReviewed = note.flashcards.reduce((sum, f) => sum + (f.timesReviewed || 0), 0);

    // Return note with stats
    const { quizzes, flashcards, ...noteData } = note;
    
    return NextResponse.json({
      ...noteData,
      stats: {
        quizCount,
        flashcardCount,
        avgQuizScore,
        totalQuestions,
        totalTimesReviewed,
      }
    });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { title, subject, description, content } = body;

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title: title || note.title,
        content: content || note.content,
        subject: subject || note.subject,
        description: description || note.description,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
