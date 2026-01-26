"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clipboard, Layers, BarChart3 } from "lucide-react";
import Header from "@/components/layout/Header";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface DashboardStats {
  notesCount: number;
  quizzesCount: number;
  currentStreak: number;
  avgScore: number;
}

interface RecentNote {
  id: string;
  title: string;
  subject: string;
  updatedAt: string;
}

interface UpcomingReview {
  subject: string;
  count: number;
  dueDate: string | null;
}

interface TodayActivity {
  quizCompleted?: number;
  flashcardReviewed?: number;
  noteAdded?: number;
  [key: string]: number | undefined;
}

interface DailyGoals {
  notes: number;
  quizzes: number;
  flashcards: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const user = session?.user?.name ?? "John";
  const t = useTranslations("dashboard");

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    notesCount: 0,
    quizzesCount: 0,
    currentStreak: 0,
    avgScore: 0,
  });
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<UpcomingReview[]>([]);
  const [todayActivity, setTodayActivity] = useState<TodayActivity>({});
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>({
    notes: 3,
    quizzes: 3,
    flashcards: 20,
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/stats")
        .then((res) => res.json())
        .then((data) => {
          // Calculate average score from weekly scores
          const weeklyScores = data.weeklyScores || [];
          const avgScore = weeklyScores.length > 0
            ? Math.round(weeklyScores.reduce((sum: number, w: { avgScore?: number; score?: number }) => sum + (w.avgScore ?? w.score ?? 0), 0) / weeklyScores.length)
            : 0;

          setDashboardStats({
            notesCount: data.counts?.notes || 0,
            quizzesCount: data.counts?.quizzes || 0,
            currentStreak: data.currentStreak || 0,
            avgScore: isNaN(avgScore) ? 0 : avgScore,
          });

          setRecentNotes(data.recentNotes || []);
          setUpcomingReviews(data.upcomingReviews || []);
          setTodayActivity(data.todayActivity || {});
          if (data.dailyGoals) {
            setDailyGoals(data.dailyGoals);
          }
        })
        .catch((err) => console.error("Failed to fetch dashboard stats:", err));
    }
  }, [status]);

  const quickActionsConfig = [
    { title: t("quickActions.createNote"), icon: <FileText className="w-5 h-5 text-[var(--color-primary)]" />, href: "/notes/new" },
    { title: t("quickActions.takeQuiz"), icon: <Clipboard className="w-5 h-5 text-[var(--color-primary)]" />, href: "/quizzes" },
    { title: t("quickActions.studyFlashcards"), icon: <Layers className="w-5 h-5 text-[var(--color-primary)]" />, href: "/flashcards" },
    { title: t("quickActions.viewProgress"), icon: <BarChart3 className="w-5 h-5 text-[var(--color-primary)]" />, href: "/progress" },
  ];

  const stats = [
    { title: t("stats.totalNotes"), value: String(dashboardStats.notesCount), subtitle: t("stats.total") },
    { title: t("stats.quizzesTaken"), value: String(dashboardStats.quizzesCount), subtitle: t("stats.completed") },
    { title: t("stats.studyStreak"), value: `${dashboardStats.currentStreak} ${t("stats.days")}`, subtitle: dashboardStats.currentStreak > 0 ? t("stats.keepItUp") : t("stats.startStreak") },
    { title: t("stats.avgScore"), value: `${dashboardStats.avgScore}%`, subtitle: t("stats.overall") },
  ];

  // Calculate today's goals based on actual activity
  const todayQuizzes = todayActivity.quizCompleted || 0;
  const todayFlashcards = todayActivity.flashcardReviewed || 0;
  const todayNotes = todayActivity.noteAdded || 0;

  // Helper function to format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return t("time.minutesAgo", { count: diffMins });
    if (diffHours < 24) return t("time.hoursAgo", { count: diffHours });
    if (diffDays === 1) return t("time.yesterday");
    return t("time.daysAgo", { count: diffDays });
  };

  // Helper function to format due time
  const formatDueTime = (dateStr: string | null) => {
    if (!dateStr) return t("time.anytime");
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMs < 0) return t("time.overdue");
    if (diffHours < 1) return t("time.soon");
    if (diffHours < 24) return t("time.inHours", { count: diffHours });
    if (diffDays === 1) return t("time.tomorrow");
    return t("time.inDays", { count: diffDays });
  };



  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">{t("welcomeBack", { name: user })}</h1>
            <p className="text-xs text-[var(--color-muted)] mt-1">{t("progressToday")}</p>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 mb-6">
          {stats.map((s, i) => (
            <Card key={i} className="bg-[var(--color-bg-light)] border-[var(--color-border)] rounded-xl shadow-none p-0">
              <CardHeader className="p-4 sm:p-3 pb-2">
                <CardTitle className="text-[10px] text-[var(--color-text)] opacity-70 font-medium">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-3 pb-3">
                <div className="text-lg font-semibold leading-tight text-[var(--color-text)]">{s.value}</div>
                <div className="text-[10px] text-[var(--color-text)] opacity-60 mt-0.5">{s.subtitle}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* main layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
          {/* LEFT (main) */}
          <div className="md:col-span-2 flex flex-col gap-6 md:gap-4">
            {/* Quick Actions */}
            <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)] rounded-xl">
              <CardHeader className="p-4 sm:p-3 pb-2">
                <CardTitle className="text-sm font-semibold">{t("quickActions.title")}</CardTitle>
                <p className="text-xs text-[var(--color-muted)] mt-1">{t("quickActions.subtitle")}</p>
              </CardHeader>

              <CardContent className="p-4 sm:p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {quickActionsConfig.map((a, i) => (
                    <a
                      key={i}
                      href={a.href}
                      className={`flex flex-col items-center justify-center gap-2 py-5 sm:py-4 px-4 rounded-xl bg-[var(--color-bg-light)] border border-[var(--color-border)] hover:bg-[var(--color-bg-darker)] hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition text-sm ${
                        a.href === "/notes/new" ? "text-white cursor-pointer" : "text-[var(--color-text)]"
                      }`}
                    >
                      <div className="rounded-full w-9 h-9 flex items-center justify-center bg-[var(--color-primary)]/10">
                        {a.icon}
                      </div>
                      <span className="mt-1">{a.title}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Notes*/}
            <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)] rounded-xl flex-1">
              <CardHeader className="flex flex-row justify-between items-start p-4 sm:p-3 pb-2">
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold text-[var(--color-text)]">{t("recentNotes.title")}</CardTitle>
                  <p className="text-xs text-[var(--color-muted)] mt-1">{t("recentNotes.subtitle")}</p>
                </div>
                <a href="/notes" className="text-[var(--color-black)] text-xs hover:underline font-medium whitespace-nowrap ml-4">{t("recentNotes.viewAll")}</a>
              </CardHeader>

              {/* Removed overflow */}
              <CardContent className="p-4 sm:p-3 space-y-4">
                {recentNotes.length > 0 ? recentNotes.map((n, i) => (
                                    <article
                    key={n.id}
                    className="bg-[var(--color-bg-light)] rounded-xl p-4 sm:p-3 flex flex-col sm:flex-row gap-3 border border-[var(--color-border)]"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-md bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 w-full">
                      {/* title / subject / time*/}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                        <div className="min-w-0">
                          {/* Allow wrapping for long titles/subjects */}
                          <a href={`/notes/${n.id}`} className="text-sm font-medium leading-snug break-words text-[var(--color-text)] hover:underline">
                            {n.title}
                          </a>
                          <p className="text-[11px] text-[var(--color-muted)] mt-1 break-words">
                            {n.subject}
                          </p>
                        </div>

                        <div className="text-[11px] text-[var(--color-muted)] mt-2 sm:mt-0 sm:ml-3 whitespace-nowrap">
                          {formatRelativeTime(n.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </article>
                )) : (
                  <div className="text-center text-sm text-[var(--color-muted)] py-4">
                    {t("recentNotes.noNotes")}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT (sidebar) */}
          <div className="flex flex-col gap-6 md:gap-4">
            {/* Today's Goal */}
            <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)] rounded-xl">
              <CardHeader className="p-4 sm:p-3 pb-2">
                <CardTitle className="text-sm font-semibold">{t("todaysGoal.title")}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-3">
                <div className="flex flex-col gap-4">
                  <GoalItem label={t("todaysGoal.notes")} value={todayNotes} total={dailyGoals.notes} />
                  <GoalItem label={t("todaysGoal.quizzes")} value={todayQuizzes} total={dailyGoals.quizzes} />
                  <GoalItem label={t("todaysGoal.flashcards")} value={todayFlashcards} total={dailyGoals.flashcards} />
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Reviews */}
            <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)] rounded-xl mt-4 md:mt-0">
              <CardHeader className="p-4 sm:p-3 pb-2">
                <CardTitle className="text-sm font-semibold text-[var(--color-text)]">{t("upcomingReviews.title")}</CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-3">
                <div className="flex flex-col gap-4 sm:gap-3">
                  {upcomingReviews.length > 0 ? upcomingReviews.map((r, i) => (
                    <div
                      key={i}
                      className="bg-[var(--color-bg-light)] rounded-xl p-4 sm:p-3 flex items-center justify-between border border-[var(--color-border)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]/90" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[var(--color-text)]">{r.subject}</span>
                          <span className="text-[11px] text-[var(--color-muted)]">{r.count} {t("upcomingReviews.cards")}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[var(--color-muted)]">{formatDueTime(r.dueDate)}</div>
                    </div>
                  )) : (
                    <div className="text-center text-sm text-[var(--color-muted)] py-4">
                      {t("upcomingReviews.noReviews")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalItem({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-sm text-[var(--color-text)]">{label}</span>
        <span className="text-sm text-[var(--color-muted)] font-medium">{value} / {total}</span>
      </div>
      <Progress value={percentage} className="h-2 bg-[var(--color-progress-bg)]" />
    </div>
  );
}
