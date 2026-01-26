import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const goals = {
      dailyNotesGoal: user.preferences?.dailyNotesGoal ?? 3,
      dailyQuizzesGoal: user.preferences?.dailyQuizzesGoal ?? 3,
      dailyFlashcardsGoal: user.preferences?.dailyFlashcardsGoal ?? 20,
    };

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    const { dailyNotesGoal, dailyQuizzesGoal, dailyFlashcardsGoal } = body;

    // Validate goals are positive numbers
    if (
      (dailyNotesGoal !== undefined && (typeof dailyNotesGoal !== "number" || dailyNotesGoal < 1)) ||
      (dailyQuizzesGoal !== undefined && (typeof dailyQuizzesGoal !== "number" || dailyQuizzesGoal < 1)) ||
      (dailyFlashcardsGoal !== undefined && (typeof dailyFlashcardsGoal !== "number" || dailyFlashcardsGoal < 1))
    ) {
      return NextResponse.json(
        { error: "Goals must be positive numbers" },
        { status: 400 }
      );
    }

    const updatedPreferences = await prisma.userPreference.upsert({
      where: { userId: user.id },
      update: {
        ...(dailyNotesGoal !== undefined && { dailyNotesGoal }),
        ...(dailyQuizzesGoal !== undefined && { dailyQuizzesGoal }),
        ...(dailyFlashcardsGoal !== undefined && { dailyFlashcardsGoal }),
      },
      create: {
        userId: user.id,
        dailyNotesGoal: dailyNotesGoal ?? 3,
        dailyQuizzesGoal: dailyQuizzesGoal ?? 3,
        dailyFlashcardsGoal: dailyFlashcardsGoal ?? 20,
      },
    });

    return NextResponse.json({
      dailyNotesGoal: updatedPreferences.dailyNotesGoal,
      dailyQuizzesGoal: updatedPreferences.dailyQuizzesGoal,
      dailyFlashcardsGoal: updatedPreferences.dailyFlashcardsGoal,
    });
  } catch (error) {
    console.error("Error updating goals:", error);
    return NextResponse.json(
      { error: "Failed to update goals" },
      { status: 500 }
    );
  }
}
