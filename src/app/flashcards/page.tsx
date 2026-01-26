"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { Search, RotateCcw, Layers, CheckCircle2, BookMarked, Plus, Trash2, Edit2, Lock, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

interface FlashcardCard {
  id: string;
  front: string;
  back: string;
  nextReview: string | null;
  timesReviewed: number;
  createdAt: string;
}

interface FlashcardSet {
  id: string;
  title: string;
  noteTitle: string;
  noteId: string | null;
  cardCount: number;
  cards: FlashcardCard[];
  lastReviewed: string | null;
  createdAt: string;
  isPrivate?: boolean;
  user?: { id: string; email: string } | null;
}

export default function FlashcardsPage() {
  const router = useRouter();
  const t = useTranslations("flashcards");
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingSetId, setDeletingSetId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "my">("all");

  const fetchFlashcards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/flashcards");
      if (!response.ok) {
        throw new Error("Failed to fetch flashcards");
      }
      const data = await response.json();
      setFlashcardSets(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching flashcards:", err);
      setError("Failed to load flashcard sets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleDelete = async (setId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t("confirmDelete") || "Are you sure you want to delete this flashcard set?")) {
      return;
    }

    try {
      setDeletingSetId(setId);
      const response = await fetch(`/api/flashcards/${setId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete flashcard set");
      }

      // Refresh the list
      await fetchFlashcards();
    } catch (err) {
      console.error("Error deleting flashcard set:", err);
      setError("Failed to delete flashcard set");
    } finally {
      setDeletingSetId(null);
    }
  };

  const filteredFlashcards = flashcardSets.filter((set) => {
    const matchesSearch =
      set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.noteTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesViewMode = viewMode === "all" || set.user?.email === session?.user?.email;
    
    return matchesSearch && matchesViewMode;
  });

  const stats = {
    total: flashcardSets.length,
    reviewed: flashcardSets.reduce((sum, set) => 
      sum + set.cards.reduce((cardSum, c) => cardSum + (c.timesReviewed || 0), 0), 0
    ),
    totalCards: flashcardSets.reduce((sum, set) => sum + set.cardCount, 0),
  };

  const formatLastReviewed = (dateStr: string | null): string => {
    if (!dateStr) return t("neverReviewed") || "Never";
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t("today") || "Today";
    if (diffDays === 1) return t("yesterday") || "Yesterday";
    if (diffDays < 7) return `${diffDays} ${t("daysAgo") || "days ago"}`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${t("weeksAgo") || "weeks ago"}`;
    return `${Math.floor(diffDays / 30)} ${t("monthsAgo") || "months ago"}`;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-start justify-between"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">
                {t("title")}
              </h1>
              <p className="text-[var(--color-muted)]">
                {t("subtitle")}
              </p>
            </div>
            <Link
              href="/flashcards/new"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">{t("createNew")}</span>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            {[
              { label: t("stats.flashcardSets"), value: stats.total, icon: Layers },
              { label: t("stats.cardsReviewed"), value: stats.reviewed, icon: CheckCircle2 },
              { label: t("stats.totalCards"), value: stats.totalCards, icon: BookMarked },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8 text-[var(--color-primary)]" />
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

          {/* View Mode Toggle */}
          {session && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex gap-2 mb-4"
            >
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === "all"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-light)] text-[var(--color-text)] hover:bg-[var(--color-bg-darker)]"
                }`}
              >
                {t("allFlashcards")}
              </button>
              <button
                onClick={() => setViewMode("my")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === "my"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-light)] text-[var(--color-text)] hover:bg-[var(--color-bg-darker)]"
                }`}
              >
                {t("myFlashcards")}
              </button>
            </motion.div>
          )}

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-[var(--color-muted)]" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-[var(--color-muted)]">{t("loading") || "Loading..."}</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
              {error}
            </div>
          )}

          {/* Flashcard Sets Grid */}
          {!isLoading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredFlashcards.length > 0 ? (
                filteredFlashcards.map((set, idx) => {
                  const reviewedCount = set.cards.reduce((sum, c) => sum + (c.timesReviewed || 0), 0);
                  const cardsReviewedAtLeastOnce = set.cards.filter(c => (c.timesReviewed || 0) > 0).length;
                  const progressPercent = set.cardCount > 0 ? (cardsReviewedAtLeastOnce / set.cardCount) * 100 : 0;
                  
                  return (
                    <motion.div
                      key={set.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + idx * 0.05 }}
                      className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                      onClick={() => router.push(`/flashcards/${set.id}/study`)}
                    >
                      {/* Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-[var(--color-text)]">
                                {set.title}
                              </h3>
                              {set.isPrivate ? (
                                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[var(--color-muted)]/20 text-[var(--color-muted)]">
                                  <Lock className="w-3 h-3" />
                                  {t("private")}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)]">
                                  <Globe className="w-3 h-3" />
                                  {t("public")}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[var(--color-muted)]">
                              {set.noteTitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2 mb-4 pb-4 border-b border-[var(--color-border)]">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[var(--color-muted)]">{t("reviewed") || "Reviewed"}</span>
                          <span className="font-medium text-[var(--color-text)]">
                            {cardsReviewedAtLeastOnce} / {set.cardCount}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[var(--color-bg-light)] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ delay: 0.4 + idx * 0.05, duration: 0.6 }}
                            className="h-full bg-[var(--color-primary)] rounded-full"
                          />
                        </div>
                        <p className="text-xs text-[var(--color-muted)]">
                          {t("lastReviewed")}: {formatLastReviewed(set.lastReviewed)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/flashcards/${set.id}/study`);
                          }}
                          className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors text-sm"
                        >
                          {t("study")}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/flashcards/${set.id}/edit`);
                          }}
                          className="px-4 py-2 bg-[var(--color-bg-light)] text-[var(--color-text)] font-medium rounded-lg hover:bg-[var(--color-bg-darker)] transition-colors text-sm"
                          title={t("edit.title") || "Edit"}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(set.id, e)}
                          disabled={deletingSetId === set.id}
                          className="px-4 py-2 bg-[var(--color-bg-light)] text-red-400 font-medium rounded-lg hover:bg-red-500/20 transition-colors text-sm disabled:opacity-50"
                          title={t("confirmDelete") || "Delete"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12"
                >
                  <p className="text-[var(--color-muted)] mb-2">
                    {t("noSetsFound")}
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {t("createFromNotes") || "Create flashcards from your notes"}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
