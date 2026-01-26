import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

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

    const { action } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    const stat = await prisma.stats.create({
      data: {
        userId: user.id,
        action,
      },
    });

    return NextResponse.json(stat);
  } catch (error) {
    console.error("Error recording stat:", error);
    return NextResponse.json(
      { error: "Failed to record stat" },
      { status: 500 }
    );
  }
}

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

    // Get stats grouped by action
    const actionStats = await prisma.stats.groupBy({
      by: ["action"],
      where: { userId: user.id },
      _count: { action: true },
      orderBy: { _count: { action: "desc" } },
    });

    // Get daily stats for the current month (for calendar)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const monthlyStats = await prisma.stats.groupBy({
      by: ["createdAt"],
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _count: { action: true },
    });

    // Transform to daily counts
    const dailyActivityMap: Record<string, number> = {};
    monthlyStats.forEach((stat) => {
      const dateStr = stat.createdAt.toISOString().split("T")[0];
      dailyActivityMap[dateStr] = (dailyActivityMap[dateStr] || 0) + stat._count.action;
    });

    const dailyStats = Object.entries(dailyActivityMap).map(([date, count]) => ({
      date,
      count,
    }));

    // Get quiz scores for weekly trend (last 4 weeks of quizzes)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const quizzes = await prisma.quiz.findMany({
      where: {
        userId: user.id,
        score: { not: null },
        updatedAt: { gte: fourWeeksAgo },
      },
      select: {
        score: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "asc" },
    });

    // Group quizzes by week and calculate average percentage score
    const weeklyScores: { week: string; score: number; weekStart: Date }[] = [];
    const weeks = [0, 1, 2, 3].map((i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (3 - i) * 7);
      weekStart.setHours(0, 0, 0, 0);
      return { weekNum: i + 1, weekStart };
    });

    weeks.forEach(({ weekNum, weekStart }) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekQuizzes = quizzes.filter(
        (q) => q.updatedAt >= weekStart && q.updatedAt < weekEnd
      );

      if (weekQuizzes.length > 0) {
        // Score is already stored as a percentage (0-100) in the database
        const avgScore =
          weekQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / weekQuizzes.length;

        weeklyScores.push({
          week: `Week ${weekNum}`,
          score: Math.round(avgScore),
          weekStart,
        });
      }
    });

    // Calculate streaks from Stats table
    const allStats = await prisma.stats.findMany({
      where: { userId: user.id },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    // Get unique dates with activity
    const activeDates = new Set<string>();
    allStats.forEach((stat) => {
      activeDates.add(stat.createdAt.toISOString().split("T")[0]);
    });

    const sortedDates = Array.from(activeDates).sort().reverse();

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // Check if there's activity today or yesterday to start counting
    if (activeDates.has(today) || activeDates.has(yesterday)) {
      let checkDate = activeDates.has(today) ? new Date() : new Date(Date.now() - 86400000);
      
      while (true) {
        const dateStr = checkDate.toISOString().split("T")[0];
        if (activeDates.has(dateStr)) {
          currentStreak++;
          checkDate = new Date(checkDate.getTime() - 86400000);
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    sortedDates.reverse().forEach((dateStr) => {
      const date = new Date(dateStr);
      if (prevDate) {
        const diffDays = Math.round(
          (date.getTime() - prevDate.getTime()) / 86400000
        );
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      prevDate = date;
    });
    longestStreak = Math.max(longestStreak, tempStreak);

    // Get actual counts from database
    const notesCount = await prisma.note.count({
      where: { userId: user.id },
    });

    const quizzesCount = await prisma.quiz.count({
      where: { userId: user.id },
    });

    const flashcardsReviewedCount = await prisma.flashcard.count({
      where: {
        userId: user.id,
        timesReviewed: { gt: 0 },
      },
    });

    const totalFlashcardReviews = await prisma.flashcard.aggregate({
      where: { userId: user.id },
      _sum: { timesReviewed: true },
    });

    // Get today's activity for dashboard goals
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayStats = await prisma.stats.groupBy({
      by: ["action"],
      where: {
        userId: user.id,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      _count: { action: true },
    });

    const todayActivity: Record<string, number> = {};
    todayStats.forEach((stat) => {
      todayActivity[stat.action] = stat._count.action;
    });

    // Get recent notes for dashboard (last 3)
    const recentNotes = await prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        subject: true,
        updatedAt: true,
      },
    });

    // Get flashcard sets with due cards for upcoming reviews
    const flashcardSets = await prisma.flashcard.findMany({
      where: { userId: user.id },
      select: {
        setTitle: true,
        nextReview: true,
      },
    });

    // Group flashcards by subject and count due cards
    const upcomingReviews: { subject: string; count: number; dueDate: Date | null }[] = [];
    const subjectMap = new Map<string, { count: number; earliestDue: Date | null }>();

    flashcardSets.forEach((fc) => {
      const subject = fc.setTitle || "General";
      const existing = subjectMap.get(subject) || { count: 0, earliestDue: null };
      existing.count++;
      if (fc.nextReview) {
        if (!existing.earliestDue || fc.nextReview < existing.earliestDue) {
          existing.earliestDue = fc.nextReview;
        }
      }
      subjectMap.set(subject, existing);
    });

    subjectMap.forEach((value, subject) => {
      if (value.count > 0) {
        upcomingReviews.push({
          subject,
          count: value.count,
          dueDate: value.earliestDue,
        });
      }
    });

    // Sort by earliest due date
    upcomingReviews.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });

    // Get user's daily goals (or defaults)
    const userPreferences = await prisma.userPreference.findUnique({
      where: { userId: user.id },
      select: {
        dailyNotesGoal: true,
        dailyQuizzesGoal: true,
        dailyFlashcardsGoal: true,
      },
    });

    const dailyGoals = {
      notes: userPreferences?.dailyNotesGoal ?? 3,
      quizzes: userPreferences?.dailyQuizzesGoal ?? 3,
      flashcards: userPreferences?.dailyFlashcardsGoal ?? 20,
    };

    return NextResponse.json({
      actionStats,
      dailyStats,
      weeklyScores,
      currentStreak,
      longestStreak,
      counts: {
        notes: notesCount,
        quizzes: quizzesCount,
        flashcardsReviewed: flashcardsReviewedCount,
        totalReviews: totalFlashcardReviews._sum.timesReviewed || 0,
      },
      todayActivity,
      recentNotes,
      upcomingReviews: upcomingReviews.slice(0, 3),
      dailyGoals,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
