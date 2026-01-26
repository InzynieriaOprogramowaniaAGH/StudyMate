import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// pobiera listę fiszek zgrupowanych po notatce (jako zestawy)
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

    // Fetch flashcards: public ones OR user's own (including private)
    const flashcards = await prisma.flashcard.findMany({
      where: {
        OR: [
          { isPrivate: false },
          ...(currentUserId ? [{ userId: currentUserId }] : [])
        ]
      },
      include: {
        note: {
          select: {
            id: true,
            title: true,
            subject: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group flashcards by noteId OR setId
    const flashcardSets: {
      id: string;
      title: string;
      noteTitle: string;
      noteId: string | null;
      cardCount: number;
      cards: typeof flashcards;
      lastReviewed: Date | null;
      createdAt: Date;
      isPrivate: boolean;
      user: { id: string; email: string } | null;
    }[] = [];

    const groupedByNote = new Map<string, typeof flashcards>();
    const groupedBySet = new Map<string, typeof flashcards>();
    const ungroupedCards: typeof flashcards = [];

    flashcards.forEach((card) => {
      if (card.noteId) {
        const existing = groupedByNote.get(card.noteId) || [];
        existing.push(card);
        groupedByNote.set(card.noteId, existing);
      } else if (card.setId) {
        const existing = groupedBySet.get(card.setId) || [];
        existing.push(card);
        groupedBySet.set(card.setId, existing);
      } else {
        ungroupedCards.push(card);
      }
    });

    // Create sets from note-grouped flashcards
    groupedByNote.forEach((cards, noteId) => {
      const firstCard = cards[0];
      const lastReviewedCard = cards.reduce((latest, card) => {
        if (!card.lastReviewedAt) return latest;
        if (!latest) return card.lastReviewedAt;
        return card.lastReviewedAt > latest ? card.lastReviewedAt : latest;
      }, null as Date | null);

      flashcardSets.push({
        id: noteId,
        title: firstCard.note?.title || "Untitled Set",
        noteTitle: firstCard.note?.subject || firstCard.note?.title || "No Subject",
        noteId: noteId,
        cardCount: cards.length,
        cards: cards,
        lastReviewed: lastReviewedCard,
        createdAt: cards.reduce((earliest, card) => 
          card.createdAt < earliest ? card.createdAt : earliest, 
          cards[0].createdAt
        ),
        isPrivate: firstCard.isPrivate,
        user: firstCard.user || null,
      });
    });

    // Create sets from setId-grouped flashcards (standalone sets)
    groupedBySet.forEach((cards, setId) => {
      const firstCard = cards[0];
      const lastReviewedCard = cards.reduce((latest, card) => {
        if (!card.lastReviewedAt) return latest;
        if (!latest) return card.lastReviewedAt;
        return card.lastReviewedAt > latest ? card.lastReviewedAt : latest;
      }, null as Date | null);

      flashcardSets.push({
        id: setId,
        title: firstCard.setTitle || "Untitled Set",
        noteTitle: firstCard.setDescription || "Standalone Set",
        noteId: null,
        cardCount: cards.length,
        cards: cards,
        lastReviewed: lastReviewedCard,
        createdAt: cards.reduce((earliest, card) => 
          card.createdAt < earliest ? card.createdAt : earliest, 
          cards[0].createdAt
        ),
        isPrivate: firstCard.isPrivate,
        user: firstCard.user || null,
      });
    });

    // Add ungrouped cards as a separate set if any exist
    if (ungroupedCards.length > 0) {
      flashcardSets.push({
        id: "ungrouped",
        title: "Standalone Flashcards",
        noteTitle: "No Note",
        noteId: null,
        cardCount: ungroupedCards.length,
        cards: ungroupedCards,
        lastReviewed: ungroupedCards.reduce((latest, card) => {
          if (!card.lastReviewedAt) return latest;
          if (!latest) return card.lastReviewedAt;
          return card.lastReviewedAt > latest ? card.lastReviewedAt : latest;
        }, null as Date | null),
        createdAt: ungroupedCards[0].createdAt,
        isPrivate: ungroupedCards[0].isPrivate,
        user: ungroupedCards[0].user || null,
      });
    }

    // Sort by most recent
    flashcardSets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json(flashcardSets);
  } catch (error) {
    console.error("Błąd pobierania fiszek:", error);
    return NextResponse.json(
      { error: "Nie udało się pobrać fiszek" },
      { status: 500 }
    );
  }
}

// dodaje nową fiszkę
export async function POST(req: Request) {
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

    const data = await req.json();

    // Support batch creation of flashcards
    if (data.flashcards && Array.isArray(data.flashcards)) {
      // Generate a unique setId for this batch of standalone flashcards
      const setId = `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const setTitle = data.title || "Untitled Set";
      const setDescription = data.description || null;
      
      const createdFlashcards = await prisma.$transaction(
        data.flashcards.map((card: any) =>
          prisma.flashcard.create({
            data: {
              front: card.front || "",
              back: card.back || "",
              frontImage: card.frontImage || null,
              backImage: card.backImage || null,
              userId: user.id,
              noteId: null,
              setId: setId,
              setTitle: setTitle,
              setDescription: setDescription,
              isPrivate: data.isPrivate ?? true,
            },
          })
        )
      );
      return NextResponse.json(createdFlashcards, { status: 201 });
    }

    // Single flashcard creation
    const newFlashcard = await prisma.flashcard.create({
      data: {
        front: data.front || "",
        back: data.back || "",
        frontImage: data.frontImage || null,
        backImage: data.backImage || null,
        userId: user.id,
        noteId: data.noteId || null,
        isPrivate: data.isPrivate ?? true,
      },
    });

    return NextResponse.json(newFlashcard, { status: 201 });
  } catch (error) {
    console.error("Błąd tworzenia fiszki:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Nie udało się utworzyć fiszki: ${errorMessage}` },
      { status: 500 }
    );
  }
}
