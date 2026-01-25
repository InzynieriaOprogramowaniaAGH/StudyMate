"use client";

import Header from "@/components/layout/Header";
import { useTranslations } from "next-intl";
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
  Lock,
  Globe,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface QuizFromDB {
  id: string;
  title: string;
  userId: string;
  user?: { id: string; email: string };
  score?: number;
  createdAt: string;
  updatedAt: string;
  totalQuestions?: number;
  isPrivate?: boolean;
  questions: any[];
}

interface Quiz extends QuizFromDB {
  subject: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  attempts: number;
  lastAttempt?: string;
  lastScore?: number;
  bestScore?: number;
  status: "Not Started" | "In Progress" | "Completed";
  isPrivate: boolean;
}

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
  const t = useTranslations("quizzes");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [activeTab, setActiveTab] = useState("All Quizzes");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmQuizId, setDeleteConfirmQuizId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleDeleteQuiz = async (quizId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quiz");
      }

      setQuizzes(quizzes.filter((q) => q.id !== quizId));
      setDeleteConfirmQuizId(null);
    } catch (err) {
      console.error("Error deleting quiz:", err);
      setError("Failed to delete quiz");
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch quizzes from API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/quizzes");
        if (!response.ok) throw new Error("Failed to fetch quizzes");
        
        const data: QuizFromDB[] = await response.json();
        
        // Transform API data - using real data from database
        const transformedQuizzes: Quiz[] = data.map((quiz) => ({
          ...quiz,
          isPrivate: quiz.isPrivate ?? true,
          subject: "General",
          level: "Intermediate" as const,
          attempts: 0,
          lastScore: quiz.score,
          bestScore: quiz.score,
          status: (quiz.score !== null && quiz.score !== undefined) ? "Completed" : "Not Started" as const,
        }));
        
        setQuizzes(transformedQuizzes);
        setError(null);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Filter logic
  const filteredQuizzes = quizzes.filter((quiz) => {
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
      (activeTab === "New" && quiz.status === "Not Started");

    return matchesSearch && matchesSubject && matchesLevel && matchesTab;
  });

  // Calculate stats
  const totalQuizzes = quizzes.length;
  const completedQuizzes = quizzes.filter(
    (q) => q.status === "Completed"
  ).length;
  const quizzesWithScores = quizzes.filter(
    (q) => q.bestScore !== null && q.bestScore !== undefined
  );
  const averageScore =
    quizzesWithScores.length > 0
      ? Math.round(
          quizzesWithScores.reduce((sum, q) => sum + (q.bestScore || 0), 0) /
            quizzesWithScores.length
        )
      : 0;
  const perfectScores = quizzes.filter((q) => q.bestScore === 100).length;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">
                {t("title")}
              </h1>
              <p className="text-sm text-[var(--color-muted)]">
                {t("subtitle")}
              </p>
            </div>
            <button
              onClick={() => router.push("/quizzes/new")}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition font-medium whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Quiz</span>
            </button>
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
                label: t("stats.totalQuizzes"),
                value: totalQuizzes,
                icon: BookOpen,
              },
              {
                label: t("stats.averageScore"),
                value: `${averageScore}%`,
                icon: Award,
              },
              {
                label: t("stats.perfectScores"),
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

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6 border-b border-[var(--color-border)] pb-4"
          >
            {[
              { key: "All Quizzes", label: t("tabs.allQuizzes") },
              { key: "Completed", label: t("tabs.completed") },
              { key: "New", label: t("tabs.new") },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
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
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-[var(--color-muted)]">{t("loading")}</p>
              </div>
            ) : error ? (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400">
                {error}
              </div>
            ) : filteredQuizzes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <BookOpen className="w-16 h-16 text-[var(--color-muted)] mb-4 opacity-50" />
                <p className="text-[var(--color-muted)] text-lg">{t("noQuizzesFound")}</p>
              </div>
            ) : (
              filteredQuizzes.map((quiz, idx) => (
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
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-700 ${
                          quiz.isPrivate 
                            ? 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]'
                            : 'bg-[var(--color-primary-10)] text-[var(--color-primary)]'
                        }`}>
                          {quiz.isPrivate ? (
                            <>
                              <Lock className="w-3 h-3" />
                              {t("privacy.private")}
                            </>
                          ) : (
                            <>
                              <Globe className="w-3 h-3" />
                              {t("privacy.public")}
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-[var(--color-muted)]">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {quiz.totalQuestions} {t("questions")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {quiz.attempts} {t("attempts")}
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
                      <div className="flex flex-col gap-2">
                        {quiz.status === "Not Started" ? (
                          <button 
                            onClick={() => router.push(`/quizzes/${quiz.id}`)}
                            className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-2"
                          >
                            <Play className="w-4 h-4" />
                            {t("startQuiz")}
                          </button>
                        ) : (
                          <button 
                            onClick={() => router.push(`/quizzes/${quiz.id}`)}
                            className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-2"
                          >
                            <Zap className="w-4 h-4" />
                            {t("retake")}
                          </button>
                        )}
                        
                        {/* Delete button - only for creator */}
                        {session?.user?.email && quiz.user?.email === session.user.email && (
                          <>
                            <button
                              onClick={() => router.push(`/quizzes/${quiz.id}/edit`)}
                              className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              {t("edit.edit")}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmQuizId(quiz.id)}
                              className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              {t("edit.delete")}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scores Section */}
                  {quiz.status === "Completed" && (
                    <div className="flex flex-wrap gap-6 pt-4 border-t border-[var(--color-border)]">
                      <div>
                        <p className="text-xs text-[var(--color-muted)] mb-1">
                          {t("lastScore")}
                        </p>
                        <p className="text-lg font-bold text-[var(--color-primary)]">
                          {quiz.lastScore}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-muted)] mb-1">
                          {t("bestScore")}
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
              ))
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirmQuizId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setDeleteConfirmQuizId(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6 max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                  {t("questionPage.deleteConfirm")}
                </h3>
                <p className="text-[var(--color-muted)] mb-6">
                  {t("questionPage.deleteMessage")}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirmQuizId(null)}
                    className="flex-1 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:bg-[var(--color-bg)]/80 transition"
                  >
                    {t("questionPage.cancel")}
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(deleteConfirmQuizId)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 disabled:opacity-50 rounded-lg transition"
                  >
                    {isDeleting ? t("questionPage.deleting") : t("questionPage.delete")}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
