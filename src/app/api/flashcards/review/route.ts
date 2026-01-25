import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Mark cards as reviewed
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cardIds, known } = body;

    if (!cardIds || !Array.isArray(cardIds) || cardIds.length === 0) {
      return NextResponse.json({ error: "Card IDs required" }, { status: 400 });
    }

    // Update each reviewed card
    const updatePromises = cardIds.map((cardId: string) => 
      prisma.flashcard.update({
        where: { 
          id: cardId,
          userId: session.user.id // Ensure user owns the card
        },
        data: {
          timesReviewed: { increment: 1 },
          lastReviewedAt: new Date(),
          nextReview: known ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null, // If known, schedule for tomorrow
          easeFactor: known ? 2.5 : 1.3, // Adjust ease factor based on response
        },
      })
    );

    await Promise.all(updatePromises);

    // Update user's progress
    await prisma.progress.upsert({
      where: { 
        id: session.user.id 
      },
      update: {
        flashcardsReviewed: { increment: cardIds.length },
      },
      create: {
        userId: session.user.id,
        flashcardsReviewed: cardIds.length,
      },
    });

    // Log stats for each reviewed card
    await prisma.stats.createMany({
      data: cardIds.map(() => ({
        userId: session.user.id,
        action: "flashcardReviewed",
      })),
    });

    return NextResponse.json({ success: true, reviewedCount: cardIds.length });
  } catch (error) {
    console.error("Error marking cards as reviewed:", error);
    return NextResponse.json(
      { error: "Failed to mark cards as reviewed" },
      { status: 500 }
    );
  }
}
