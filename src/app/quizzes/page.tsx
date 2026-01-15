"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  Play,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  questions: number;
  attempts: number;
  lastAttempt?: string;
  lastScore?: number;
  bestScore?: number;
  status: "Not Started" | "In Progress" | "Completed";
}

const MOCK_QUIZZES: Quiz[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    subject: "Computer Science",
    level: "Advanced",
    questions: 15,
    attempts: 3,
    lastAttempt: "2 hours ago",
    lastScore: 87,
    bestScore: 92,
    status: "In Progress",
  },
  {
    id: "2",
    title: "World War II Timeline",
    subject: "History",
    level: "Intermediate",
    questions: 20,
    attempts: 2,
    lastAttempt: "Yesterday",
    lastScore: 78,
    bestScore: 85,
    status: "Completed",
  },
  {
    id: "3",
    title: "Organic Chemistry Basics",
    subject: "Chemistry",
    level: "Beginner",
    questions: 12,
    attempts: 0,
    status: "Not Started",
  },
  {
    id: "4",
    title: "Quantum Mechanics Fundamentals",
    subject: "Physics",
    level: "Advanced",
    questions: 18,
    attempts: 1,
    lastAttempt: "3 days ago",
    lastScore: 72,
    bestScore: 72,
    status: "In Progress",
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "bg-[var(--color-success-10)] text-[var(--color-success)] border border-[var(--color-success)]/30";
    case "Intermediate":
      return "bg-[var(--color-warning-10)] text-[var(--color-warning)] border border-[var(--color-warning)]/30";
    case "Advanced":
      return "bg-[var(--color-error-10)] text-[var(--color-error)] border border-[var(--color-error)]/30";
    default:
      return "bg-[var(--color-muted)]/10 text-[var(--color-muted)] border border-[var(--color-muted)]/30";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Not Started":
      return <Zap className="w-4 h-4" />;
    case "In Progress":
      return <Clock className="w-4 h-4" />;
    case "Completed":
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Not Started":
      return "text-[var(--color-primary)]";
    case "In Progress":
      return "text-[var(--color-warning)]";
    case "Completed":
      return "text-[var(--color-success)]";
    default:
      return "text-[var(--color-muted)]";
  }
};

export default function QuizzesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [activeTab, setActiveTab] = useState("All Quizzes");
  const router = useRouter();

  // Filter logic
  const filteredQuizzes = MOCK_QUIZZES.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject =
      selectedSubject === "All Subjects" || quiz.subject === selectedSubject;

    const matchesLevel =
      selectedLevel === "All Levels" || quiz.level === selectedLevel;

    const matchesTab =
      activeTab === "All Quizzes" ||
      (activeTab === "Completed" && quiz.status === "Completed") ||
      (activeTab === "In Progress" && quiz.status === "In Progress") ||
      (activeTab === "New" && quiz.status === "Not Started");

    return matchesSearch && matchesSubject && matchesLevel && matchesTab;
  });

  // Calculate stats
  const totalQuizzes = MOCK_QUIZZES.length;
  const completedQuizzes = MOCK_QUIZZES.filter(
    (q) => q.status === "Completed"
  ).length;
  const averageScore =
    Math.round(
      MOCK_QUIZZES.filter((q) => q.bestScore)
        .reduce((sum, q) => sum + (q.bestScore || 0), 0) /
        MOCK_QUIZZES.filter((q) => q.bestScore).length
    ) || 0;
  const perfectScores = MOCK_QUIZZES.filter((q) => q.bestScore === 100).length;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">
              My Quizzes
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              Test your knowledge and track your progress
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              {
                label: "Total Quizzes",
                value: totalQuizzes,
                icon: BookOpen,
              },
              {
                label: "Average Score",
                value: `${averageScore}%`,
                icon: Award,
              },
              {
                label: "Perfect Scores",
                value: perfectScores,
                icon: CheckCircle2,
              },
            ].map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <IconComponent className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-sm text-[var(--color-muted)] font-medium mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-2xl font-bold text-[var(--color-text)]">
                    {stat.value}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-4 mb-6"
          >
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[var(--color-muted)]" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="custom-select"
                  >
                    <option>All Subjects</option>
                    <option>Computer Science</option>
                    <option>History</option>
                    <option>Chemistry</option>
                    <option>Physics</option>
                  </select>
                </div>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="custom-select"
                >
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6 border-b border-[var(--color-border)] pb-4"
          >
            {["All Quizzes", "Completed", "In Progress", "New"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* Quizzes List */}
          <div className="space-y-4">
            {filteredQuizzes.map((quiz, idx) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-primary)]/50 transition-all"
              >
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[var(--color-text)]">
                          {quiz.title}
                        </h3>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {quiz.subject}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getLevelColor(quiz.level)}`}>
                          {quiz.level}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-[var(--color-muted)]">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {quiz.questions} questions
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {quiz.attempts} attempts
                        </div>
                        {quiz.lastAttempt && (
                          <div className="flex items-center gap-1">
                            {quiz.lastAttempt}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-3">
                      {quiz.status === "Not Started" ? (
                        <button 
                          onClick={() => router.push(`/quizzes/${quiz.id}/question`)}
                          className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Start Quiz
                        </button>
                      ) : (
                        <button 
                          onClick={() => router.push(`/quizzes/${quiz.id}/question`)}
                          className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-2"
                        >
                          <Zap className="w-4 h-4" />
                          Retake
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Scores Section */}
                  {(quiz.lastScore || quiz.bestScore) && (
                    <div className="flex flex-wrap gap-6 pt-4 border-t border-[var(--color-border)]">
                      <div>
                        <p className="text-xs text-[var(--color-muted)] mb-1">
                          Last Score
                        </p>
                        <p className="text-lg font-bold text-[var(--color-primary)]">
                          {quiz.lastScore}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-muted)] mb-1">
                          Best Score
                        </p>
                        <p className="text-lg font-bold text-[var(--color-primary)]">
                          {quiz.bestScore}%
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${getStatusColor(quiz.status)}`}>
                      {getStatusIcon(quiz.status)}
                      {quiz.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredQuizzes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4 opacity-50" />
              <p className="text-[var(--color-muted)]">No quizzes found</p>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
