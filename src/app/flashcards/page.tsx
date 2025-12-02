"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { Search, Filter, RotateCcw, Layers, CheckCircle2, BookMarked } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FlashcardSet {
  id: string;
  title: string;
  noteTitle: string;
  cardCount: number;
  reviewed: number;
  lastReviewed: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const MOCK_FLASHCARDS: FlashcardSet[] = [
  {
    id: "1",
    title: "Biology Basics",
    noteTitle: "Introduction to Biology",
    cardCount: 24,
    reviewed: 18,
    lastReviewed: "2 days ago",
    difficulty: "Easy",
  },
  {
    id: "2",
    title: "Spanish Vocabulary",
    noteTitle: "Spanish Lesson 5",
    cardCount: 32,
    reviewed: 12,
    lastReviewed: "5 days ago",
    difficulty: "Medium",
  },
  {
    id: "3",
    title: "Chemistry Reactions",
    noteTitle: "Organic Chemistry",
    cardCount: 18,
    reviewed: 8,
    lastReviewed: "1 week ago",
    difficulty: "Hard",
  },
  {
    id: "4",
    title: "History Dates",
    noteTitle: "Medieval Europe",
    cardCount: 28,
    reviewed: 28,
    lastReviewed: "Yesterday",
    difficulty: "Easy",
  },
];

export default function FlashcardsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  const filteredFlashcards = MOCK_FLASHCARDS.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.noteTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || card.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const stats = {
    total: MOCK_FLASHCARDS.length,
    reviewed: MOCK_FLASHCARDS.reduce((sum, card) => sum + card.reviewed, 0),
    totalCards: MOCK_FLASHCARDS.reduce((sum, card) => sum + card.cardCount, 0),
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
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
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">
              Study Flashcards
            </h1>
            <p className="text-[var(--color-muted)]">
              Review and master your flashcard sets
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            {[
              { label: "Flashcard Sets", value: stats.total, icon: Layers },
              { label: "Cards Reviewed", value: stats.reviewed, icon: CheckCircle2 },
              { label: "Total Cards", value: stats.totalCards, icon: BookMarked },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-4 text-center"
                >
                  <Icon className="w-6 h-6 text-[var(--color-primary)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--color-muted)] mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-[var(--color-primary)]">{stat.value}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 space-y-4"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-[var(--color-muted)]" />
              <input
                type="text"
                placeholder="Search flashcard sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-[var(--color-muted)] mt-2" />
              {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setDifficultyFilter(difficulty as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    difficultyFilter === difficulty
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-bg-light)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Flashcard Sets Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredFlashcards.length > 0 ? (
              filteredFlashcards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + idx * 0.05 }}
                  className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                  onClick={() => router.push(`/flashcards/${card.id}/study`)}
                >
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--color-text)]">
                          {card.title}
                        </h3>
                        <p className="text-sm text-[var(--color-muted)]">
                          {card.noteTitle}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                          card.difficulty
                        )}`}
                      >
                        {card.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-[var(--color-border)]">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--color-muted)]">Cards</span>
                      <span className="font-medium text-[var(--color-text)]">
                        {card.reviewed} / {card.cardCount}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(card.reviewed / card.cardCount) * 100}%` }}
                        transition={{ delay: 0.4 + idx * 0.05, duration: 0.6 }}
                        className="h-full bg-[var(--color-primary)] rounded-full"
                      />
                    </div>
                    <p className="text-xs text-[var(--color-muted)]">
                      Last reviewed: {card.lastReviewed}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/flashcards/${card.id}/study`);
                      }}
                      className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors text-sm"
                    >
                      Study
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors text-sm"
                      title="Retry all cards"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <p className="text-[var(--color-muted)] mb-2">
                  No flashcard sets found
                </p>
                <p className="text-sm text-[var(--color-muted)]">
                  Try adjusting your filters or search query
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
