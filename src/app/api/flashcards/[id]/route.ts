import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET a specific flashcard set by noteId, setId, or "ungrouped"
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    let flashcards;
    let setTitle = "Untitled Set";
    let noteTitle = "No Subject";

    if (id === "ungrouped") {
      // Fetch ungrouped flashcards (no noteId and no setId)
      flashcards = await prisma.flashcard.findMany({
        where: {
          noteId: null,
          setId: null,
          OR: [
            { isPrivate: false },
            ...(currentUserId ? [{ userId: currentUserId }] : [])
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });
      setTitle = "Ungrouped Flashcards";
      noteTitle = "Various Topics";
    } else if (id.startsWith("set_")) {
      // Fetch flashcards by setId (standalone sets)
      flashcards = await prisma.flashcard.findMany({
        where: {
          setId: id,
          OR: [
            { isPrivate: false },
            ...(currentUserId ? [{ userId: currentUserId }] : [])
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      if (flashcards.length > 0 && flashcards[0].setTitle) {
        setTitle = flashcards[0].setTitle;
        noteTitle = flashcards[0].setDescription || "Standalone Set";
      }
    } else {
      // Fetch flashcards by noteId
      flashcards = await prisma.flashcard.findMany({
        where: {
          noteId: id,
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
        orderBy: { createdAt: "asc" },
      });

      if (flashcards.length > 0 && flashcards[0]?.note) {
        setTitle = flashcards[0].note?.title || "Untitled";
        noteTitle = flashcards[0].note?.subject || flashcards[0].note?.title || "No Subject";
      }
    }

    if (flashcards.length === 0) {
      return NextResponse.json(
        { error: "Flashcard set not found" },
        { status: 404 }
      );
    }

    // Format the response
    const flashcardSet = {
      id: id,
      title: setTitle,
      noteTitle: noteTitle,
      cards: flashcards.map((card) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        frontImage: card.frontImage,
        backImage: card.backImage,
        createdAt: card.createdAt.toISOString(),
      })),
      cardCount: flashcards.length,
      createdAt: flashcards[0].createdAt.toISOString(),
    };

    return NextResponse.json(flashcardSet);
  } catch (error) {
    console.error("Error fetching flashcard set:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcard set" },
      { status: 500 }
    );
  }
}

// DELETE a flashcard set
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

    // Delete by setId (standalone sets) or noteId
    if (id.startsWith("set_")) {
      await prisma.flashcard.deleteMany({
        where: {
          setId: id,
          userId: user.id,
        },
      });
    } else if (id === "ungrouped") {
      await prisma.flashcard.deleteMany({
        where: {
          noteId: null,
          setId: null,
          userId: user.id,
        },
      });
    } else {
      await prisma.flashcard.deleteMany({
        where: {
          noteId: id,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting flashcard set:", error);
    return NextResponse.json(
      { error: "Failed to delete flashcard set" },
      { status: 500 }
    );
  }
}

// PATCH - Update a flashcard set
export async function PATCH(
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

    const data = await request.json();

    // Update set metadata (title, description) for standalone sets
    if (id.startsWith("set_") && (data.title || data.description !== undefined)) {
      await prisma.flashcard.updateMany({
        where: {
          setId: id,
          userId: user.id,
        },
        data: {
          ...(data.title && { setTitle: data.title }),
          ...(data.description !== undefined && { setDescription: data.description }),
          ...(data.isPrivate !== undefined && { isPrivate: data.isPrivate }),
        },
      });
    }

    // Update individual cards if provided
    if (data.cards && Array.isArray(data.cards)) {
      for (const card of data.cards) {
        if (card.id) {
          // Update existing card
          await prisma.flashcard.update({
            where: { id: card.id },
            data: {
              front: card.front ?? undefined,
              back: card.back ?? undefined,
              frontImage: card.frontImage,
              backImage: card.backImage,
            },
          });
        } else {
          // Create new card in this set
          await prisma.flashcard.create({
            data: {
              front: card.front || "",
              back: card.back || "",
              frontImage: card.frontImage || null,
              backImage: card.backImage || null,
              userId: user.id,
              setId: id.startsWith("set_") ? id : null,
              noteId: id.startsWith("set_") ? null : id,
              setTitle: data.title || null,
              setDescription: data.description || null,
              isPrivate: data.isPrivate ?? true,
            },
          });
        }
      }
    }

    // Delete cards that were removed
    if (data.deletedCardIds && Array.isArray(data.deletedCardIds)) {
      await prisma.flashcard.deleteMany({
        where: {
          id: { in: data.deletedCardIds },
          userId: user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating flashcard set:", error);
    return NextResponse.json(
      { error: "Failed to update flashcard set" },
      { status: 500 }
    );
  }
}
