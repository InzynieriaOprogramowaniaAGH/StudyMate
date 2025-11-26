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
    const stats = await prisma.stats.groupBy({
      by: ["action"],
      where: { userId: user.id },
      _count: { action: true },
      orderBy: { _count: { action: "desc" } },
    });

    // Get daily stats for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "Stats"
      WHERE "userId" = ${user.id} AND "createdAt" >= ${sevenDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `;

    return NextResponse.json({
      actionStats: stats,
      dailyStats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
