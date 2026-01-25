"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Home, 
  RotateCcw, 
  BookOpen, 
  Trophy,
  TrendingUp,
  FileText,
  LayoutDashboard
} from "lucide-react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function FlashcardResultsPage() {
  const router = useRouter();
  const params = useParams();
  const setId = params.id as string;
  const searchParams = useSearchParams();
  const t = useTranslations("flashcards.results");
  
  const known = parseInt(searchParams.get("known") || "0");
  const studied = parseInt(searchParams.get("studied") || "0");
  const timeParam = searchParams.get("time");
  const timeElapsed = timeParam ? parseInt(timeParam) : 0;
  
  const total = known + studied;
  const percentage = total > 0 ? Math.round((known / total) * 100) : 0;
  const needsReview = studied;

  const [flashcardSetTitle, setFlashcardSetTitle] = useState<string>("");

  useEffect(() => {
    const fetchSetInfo = async () => {
      try {
        const response = await fetch(`/api/flashcards/${setId}`);
        if (response.ok) {
          const data = await response.json();
          setFlashcardSetTitle(data.title || "Flashcard Set");
        }
      } catch (error) {
        console.error("Failed to fetch flashcard set info:", error);
      }
    };
    
    if (setId) {
      fetchSetInfo();
    }
  }, [setId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getMessage = (percentage: number) => {
    if (percentage >= 90) return t("messages.outstanding");
    if (percentage >= 80) return t("messages.greatJob");
    if (percentage >= 70) return t("messages.goodWork");
    if (percentage >= 60) return t("messages.notBad");
    return t("messages.keepPracticing");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-6 text-center"
          >
            {/* Trophy Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
            </div>

            {/* Message */}
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
              {getMessage(percentage)}
            </h1>
            <p className="text-[var(--color-muted)] mb-1">{flashcardSetTitle}</p>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              {t("sessionComplete")}
            </p>

            {/* Big Percentage */}
            <div className="text-6xl font-bold text-[var(--color-primary)] mb-2">
              {percentage}%
            </div>
            <p className="text-[var(--color-muted)] mb-8">
              {t("cardsMastered", { known, total })}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={`/flashcards/${setId}/study`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                {t("tryAgain")}
              </Link>
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-[var(--color-text)] rounded-lg hover:bg-slate-700 transition font-medium"
              >
                <FileText className="w-4 h-4" />
                {t("viewNotes")}
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-[var(--color-text)] rounded-lg hover:bg-slate-700 transition font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                {t("dashboard")}
              </Link>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6"
          >
            {/* Known Cards */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-[var(--color-muted)] mb-2">
                <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                <span className="text-sm">{t("known")}</span>
              </div>
              <p className="text-3xl font-bold text-[var(--color-success)]">
                {known}
              </p>
            </div>

            {/* Needs Review */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-[var(--color-muted)] mb-2">
                <XCircle className="w-4 h-4 text-[var(--color-error)]" />
                <span className="text-sm">{t("needsReview")}</span>
              </div>
              <p className="text-3xl font-bold text-[var(--color-error)]">
                {needsReview}
              </p>
            </div>

            {/* Time Spent */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-[var(--color-muted)] mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{t("time")}</span>
              </div>
              <p className="text-3xl font-bold text-[var(--color-text)]">
                {formatTime(timeElapsed)}
              </p>
            </div>
          </motion.div>

          {/* Performance Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {t("performanceAnalysis")}
              </h2>
            </div>
            <p className="text-sm text-[var(--color-muted)] mb-4">
              {t("detailedAnalysis")}
            </p>

            {/* Mastery Rate */}
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--color-muted)]">{t("mastery")}</span>
                <span className="text-[var(--color-primary)] font-medium">
                  {percentage}%
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-[var(--color-primary)]"
                />
              </div>
            </div>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {t("tips.title")}
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary)] mt-0.5">•</span>
                <span>{t("tips.tip1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary)] mt-0.5">•</span>
                <span>{t("tips.tip2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-primary)] mt-0.5">•</span>
                <span>{t("tips.tip3")}</span>
              </li>
            </ul>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end"
          >
            <Link
              href="/dashboard"
              className="px-6 py-2 border border-slate-700 text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              {t("backToHome")}
            </Link>
            <Link
              href="/flashcards"
              className="px-6 py-2 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center"
            >
              {t("studyMoreSets")}
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
