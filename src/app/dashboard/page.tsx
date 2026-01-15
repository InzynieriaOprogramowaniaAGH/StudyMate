"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/custom_button";
import { FileText, Clipboard, Layers, BarChart3, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const user = useSession().data?.user?.name ?? "John";

  const quickActionsConfig = [
    { title: "Create Note", icon: <FileText className="w-5 h-5 text-[var(--color-primary)]" />, href: "/notes/new" },
    { title: "Take Quiz", icon: <Clipboard className="w-5 h-5 text-[var(--color-primary)]" />, href: "/quizzes" },
    { title: "Study Flashcards", icon: <Layers className="w-5 h-5 text-[var(--color-primary)]" />, href: "/flashcards" },
    { title: "View Progress", icon: <BarChart3 className="w-5 h-5 text-[var(--color-primary)]" />, href: "/progress" },
  ];

  const stats = [
    { title: "Total Notes", value: "24", subtitle: "+3 from last week" },
    { title: "Quizzes Taken", value: "47", subtitle: "+12 from last week" },
    { title: "Study Streak", value: "7 days", subtitle: "Keep it up!" },
    { title: "Avg. Score", value: "87%", subtitle: "+5% from last week" },
  ];

  const recentNotes = [
    { title: "Introduction to Machine Learning — A very long title to show wrapping behavior on mobile and ensure it breaks to multiple lines nicely", subject: "Computer Science — Advanced Topics and Subsections", time: "2 hours ago", progress: 85 },
    { title: "World War II Timeline", subject: "History", time: "Yesterday", progress: 60 },
    { title: "Organic Chemistry Basics", subject: "Chemistry", time: "2 days ago", progress: 45 },
  ];

  const aiSuggestions = [
    { title: "Review Chemistry Notes", desc: "You haven’t reviewed these in 3 days" },
    { title: "Practice ML Concepts", desc: "Your quiz score was 75%, try again!" },
    { title: "Create History Flashcards", desc: "Generate cards from your WWII notes" },
  ];

  const reviews = [
    { subject: "Biology", count: 12, time: "in 2 hours" },
    { subject: "Physics", count: 8, time: "Tomorrow" },
    { subject: "Literature", count: 15, time: "in 2 days" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">Welcome back, {user}!</h1>
            <p className="text-xs text-[var(--color-muted)] mt-1">Here’s your learning progress today</p>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 mb-6">
          {stats.map((s, i) => (
            <Card key={i} className="bg-[var(--color-bg-light)] border-[var(--color-border)] shadow-none p-0">
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
            <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)]">
              <CardHeader className="p-4 sm:p-3 pb-2">
                <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
                <p className="text-xs text-[var(--color-muted)] mt-1">Start studying or create new content</p>
              </CardHeader>

              <CardContent className="p-4 sm:p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {quickActionsConfig.map((a, i) => (
                    <a
                      key={i}
                      href={a.href}
                      className="flex flex-col items-center justify-center gap-2 py-5 sm:py-4 px-4 rounded-md bg-[var(--color-bg-light)] border border-[var(--color-border)] hover:bg-[var(--color-bg-light)] hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition text-sm text-[var(--color-text)]"
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
            <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)] flex-1">
              <CardHeader className="flex flex-row justify-between items-start p-4 sm:p-3 pb-2">
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold text-[var(--color-text)]">Recent Notes</CardTitle>
                  <p className="text-xs text-[var(--color-muted)] mt-1">Your latest study materials</p>
                </div>
                <a href="/notes" className="text-[var(--color-white)] text-xs hover:underline font-medium whitespace-nowrap ml-4">View All</a>
              </CardHeader>

              {/* Removed overflow */}
              <CardContent className="p-4 sm:p-3 space-y-4">
                {recentNotes.map((n, i) => (
                                    <article
                    key={i}
                    className="bg-[var(--color-bg-light)] rounded-md p-4 sm:p-3 flex flex-col sm:flex-row gap-3 border border-[var(--color-border)]"
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
                          <h3 className="text-sm font-medium leading-snug break-words text-[var(--color-text)]">
                            {n.title}
                          </h3>
                          <p className="text-[11px] text-[var(--color-muted)] mt-1 break-words">
                            {n.subject}
                          </p>
                        </div>

                        <div className="text-[11px] text-[var(--color-muted)] mt-2 sm:mt-0 sm:ml-3 whitespace-nowrap">
                          {n.time}
                        </div>
                      </div>

                      {/* progress row*/}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1">
                          <Progress value={n.progress} className="h-2 bg-[var(--color-progress-bg)]" />
                        </div>
                        <div className="text-[11px] text-[var(--color-text)] opacity-70 w-14 text-right font-medium">
                          {n.progress}%
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT (sidebar) */}
          <div className="flex flex-col gap-6 md:gap-4">
            {/* Today's Goal */}
            <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)]">
              <CardHeader className="p-4 sm:p-3 pb-2">
                <CardTitle className="text-sm font-semibold">Today's Goal</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-3">
                <div className="flex flex-col gap-4">
                  <GoalItem label="Study Time" value={45} total={60} />
                  <GoalItem label="Quizzes" value={2} total={3} />
                  <GoalItem label="Flashcards" value={15} total={20} />
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card className="bg-[var(--color-accent-dark)] border-[var(--color-accent-border)] mt-4 md:mt-0">
              <CardHeader className="p-4 sm:p-3 pb-2">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                  <CardTitle className="text-sm font-semibold text-[var(--color-text)]">AI Suggestions</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-3 pt-1">
                <div className="flex flex-col gap-3">
                  {aiSuggestions.map((s, i) => (
                    <button
                      key={i}
                      className="w-full text-left bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 flex flex-col gap-1 transition hover:border-[var(--color-accent)] hover:shadow-lg hover:shadow-[var(--color-accent)]/20"
                      aria-label={s.title}
                    >
                      <span className="text-sm font-medium text-[var(--color-text)] leading-tight">{s.title}</span>
                      <span className="text-[11px] text-[var(--color-text)] opacity-70">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Reviews */}
            <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)] mt-4 md:mt-0">
              <CardHeader className="p-4 sm:p-3 pb-2">
                <CardTitle className="text-sm font-semibold text-[var(--color-text)]">Upcoming Reviews</CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-3">
                <div className="flex flex-col gap-4 sm:gap-3">
                  {reviews.map((r, i) => (
                    <div
                      key={i}
                      className="bg-[var(--color-bg-light)] rounded-xl p-4 sm:p-3 flex items-center justify-between border border-[var(--color-border)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]/90" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[var(--color-text)]">{r.subject}</span>
                          <span className="text-[11px] text-[var(--color-muted)]">{r.count} cards</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[var(--color-muted)]">{r.time}</div>
                    </div>
                  ))}
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
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-sm text-[var(--color-text)]">{label}</span>
        <span className="text-sm text-[var(--color-muted)] font-medium">{value} / {total}</span>
      </div>
      <Progress value={(value / total) * 100} className="h-2 bg-[var(--color-progress-bg)]" />
    </div>
  );
}
