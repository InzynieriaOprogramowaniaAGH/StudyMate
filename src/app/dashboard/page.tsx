"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/custom_button";
import { Plus, BookOpen, LineChart } from "lucide-react";

export default function DashboardPage() {
  const [user] = useState("John");

  const quickActions = [
    { title: "Create Note", icon: <Plus className="w-4 h-4" /> },
    { title: "Take Quiz", icon: <BookOpen className="w-4 h-4" /> },
    { title: "Study Flashcards", icon: <LineChart className="w-4 h-4" /> },
    { title: "View Progress", icon: <LineChart className="w-4 h-4" /> },
  ];

  const stats = [
    { title: "Total Notes", value: "24", subtitle: "+3 from last week" },
    { title: "Quizzes Taken", value: "47", subtitle: "+12 from last week" },
    { title: "Study Streak", value: "7 days", subtitle: "Keep it up!" },
    { title: "Avg. Score", value: "87%", subtitle: "+5% from last week" },
  ];

  const recentNotes = [
    { title: "Introduction to Machine Learning", subject: "Computer Science", time: "2 hours ago", progress: 65 },
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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-[Clarity City] px-8 py-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user}!</h1>
          <p className="text-[var(--color-muted)] mt-1">
            Here’s your learning progress today
          </p>
        </div>
        <nav className="flex gap-6 text-sm text-[var(--color-muted)]">
          <a href="/dashboard" className="hover:text-[var(--color-primary)]">Dashboard</a>
          <a href="/notes" className="hover:text-[var(--color-primary)]">Notes</a>
          <a href="/progress" className="hover:text-[var(--color-primary)]">Progress</a>
          <div className="w-8 h-8 bg-[var(--color-border)] rounded-full" />
        </nav>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <Card key={i} className="bg-[var(--color-bg-light)] border-[var(--color-border)] shadow-none">
            <CardHeader>
              <CardTitle className="text-sm text-[var(--color-muted)]">{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{s.value}</div>
              <div className="text-xs text-[var(--color-muted)]">{s.subtitle}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Quick Actions */}
          <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)]">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-sm text-[var(--color-muted)]">
                Start studying or create new content
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((a, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="bg-[var(--color-bg-darker)] border-[var(--color-border)] flex flex-col gap-2 py-6"
                  >
                    {a.icon}
                    {a.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)]">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Recent Notes</CardTitle>
              <a href="#" className="text-[var(--color-primary)] text-sm">View All</a>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {recentNotes.map((n, i) => (
                <div key={i} className="flex flex-col bg-[var(--color-bg-darker)] rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--color-white)] font-medium">{n.title}</span>
                    <span className="text-[var(--color-muted)]">{n.time}</span>
                  </div>
                  <div className="text-xs text-[var(--color-muted)] mb-2">{n.subject}</div>
                  <Progress value={n.progress} className="h-2 bg-[var(--color-border)]" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          {/* Today’s Goal */}
          <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)]">
            <CardHeader>
              <CardTitle>Today's Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <GoalItem label="Study Time" value={45} total={60} />
              <GoalItem label="Quizzes" value={2} total={3} />
              <GoalItem label="Flashcards" value={15} total={20} />
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)]">
            <CardHeader>
              <CardTitle>AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {aiSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="bg-[var(--color-accent-10)] rounded-xl p-3 hover:bg-[var(--color-accent-10)/70] transition"
                >
                  <div className="font-medium">{s.title}</div>
                  <div className="text-sm text-[var(--color-muted)]">{s.desc}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Reviews */}
          <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)]">
            <CardHeader>
              <CardTitle>Upcoming Reviews</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {reviews.map((r, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{r.subject}</span>
                  <span className="text-[var(--color-muted)]">{r.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function GoalItem({ label, value, total }: { label: string; value: number; total: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value} / {total}</span>
      </div>
      <Progress value={(value / total) * 100} className="h-2 bg-[var(--color-border)]" />
    </div>
  );
}
