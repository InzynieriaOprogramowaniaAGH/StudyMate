"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/custom_button";
import { FileText, Clipboard, Layers, BarChart3, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const user = useSession().data?.user?.name ?? "John";

  const quickActions = [
    { title: "Create Note", icon: <FileText className="w-5 h-5 text-[var(--color-primary)]" /> },
    { title: "Take Quiz", icon: <Clipboard className="w-5 h-5 text-[var(--color-primary)]" /> },
    { title: "Study Flashcards", icon: <Layers className="w-5 h-5 text-[var(--color-primary)]" /> },
    { title: "View Progress", icon: <BarChart3 className="w-5 h-5 text-[var(--color-primary)]" /> },
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
                <CardTitle className="text-[10px] text-[var(--color-muted)] font-medium">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-3 pb-3">
                <div className="text-lg font-semibold leading-tight">{s.value}</div>
                <div className="text-[10px] text-[var(--color-muted)] mt-0.5">{s.subtitle}</div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickActions.map((a, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="flex flex-col items-center justify-center gap-2 py-5 sm:py-4 bg-[var(--color-bg-darker)] border-[var(--color-border)] hover:bg-[var(--color-bg)] transition text-sm"
                      aria-label={a.title}
                    >
                      <div className="rounded-full w-9 h-9 flex items-center justify-center bg-[rgba(255,255,255,0.02)]">
                        {a.icon}
                      </div>
                      <span className="mt-1">{a.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Notes (mobile-friendly, no internal scroll, wrap text) */}
            <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)] flex-1">
              <CardHeader className="flex justify-between items-start p-4 sm:p-3 pb-2">
                <div>
                  <CardTitle className="text-sm font-semibold">Recent Notes</CardTitle>
                  <p className="text-xs text-[var(--color-muted)] mt-1">Your latest study materials</p>
                </div>
                <a href="#" className="text-[var(--color-primary)] text-xs hover:underline">View All</a>
              </CardHeader>

              {/* Removed overflow / max height so the list doesn't scroll internally.
                  The page will scroll as needed (preferred on mobile). */}
              <CardContent className="p-4 sm:p-3 space-y-4">
                {recentNotes.map((n, i) => (
                  <article
                    key={i}
                    className="bg-[var(--color-bg-darker)] rounded-md p-4 sm:p-3 flex flex-col sm:flex-row gap-3"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-md bg-[rgba(255,255,255,0.02)] flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 w-full">
                      {/* title / subject / time — stack on mobile, inline-ish on sm+ */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                        <div className="min-w-0">
                          {/* Allow wrapping for long titles/subjects */}
                          <h3 className="text-sm font-medium leading-snug break-words">
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

                      {/* progress row - progress fills remaining width and percentage sits to the right on larger screens */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1">
                          <Progress value={n.progress} className="h-2 bg-[var(--color-border)] w-full" />
                        </div>
                        <div className="text-[11px] text-[var(--color-muted)] w-14 text-right">
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
            <div
              className="rounded-xl mt-4 md:mt-0"
              style={{
                boxShadow: "inset 0 0 0 1px rgba(162,120,255,0.30)",
                borderRadius: "14px",
              }}
            >
              <div className="bg-[var(--color-accent-dark)] rounded-xl overflow-hidden">
                {/* header */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                    <span className="text-sm font-medium">AI Suggestions</span>
                  </div>
                </div>

                {/* items */}
                <div className="px-4 pb-4 pt-1">
                  <div className="flex flex-col gap-3">
                    {aiSuggestions.map((s, i) => (
                      <button
                        key={i}
                        className="w-full text-left bg-[var(--color-bg-darker)] border-[var(--color-border)] rounded-lg p-3 flex flex-col gap-1 transition hover:bg-[rgba(255,255,255,0.01)]"
                        aria-label={s.title}
                      >
                        <span className="text-sm font-medium text-white leading-tight">{s.title}</span>
                        <span className="text-[11px] text-[var(--color-muted)]">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Reviews */}
            <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)] mt-4 md:mt-0">
              <CardHeader className="p-4 sm:p-3 pb-2">
                <CardTitle className="text-sm font-semibold">Upcoming Reviews</CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-3">
                <div className="flex flex-col gap-4 sm:gap-3">
                  {reviews.map((r, i) => (
                    <div
                      key={i}
                      className="bg-[var(--color-bg-darker)] rounded-xl p-4 sm:p-3 flex items-center justify-between border border-[rgba(255,255,255,0.03)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]/90" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{r.subject}</span>
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
        <span className="text-sm">{label}</span>
        <span className="text-sm">{value} / {total}</span>
      </div>
      <Progress value={(value / total) * 100} className="h-2 bg-[var(--color-border)]" />
    </div>
  );
}
