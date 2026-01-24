"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Home, RotateCcw, BookOpen, Check, Layers, TrendingUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function FlashcardResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("flashcards.results");
  const tStudy = useTranslations("flashcards.studyPage");
  const known = parseInt(searchParams.get("known") || "0");
  const studied = parseInt(searchParams.get("studied") || "0");
  const total = known + studied;
  const percentage = total > 0 ? Math.round((known / total) * 100) : 0;

  const handleContinue = () => {
    router.push("/flashcards");
  };

  const handleRetry = () => {
    router.push("/flashcards/1/study");
  };

  const getMessage = (percentage: number) => {
    if (percentage >= 90) return t("messages.outstanding");
    if (percentage >= 80) return t("messages.greatJob");
    if (percentage >= 70) return t("messages.goodWork");
    if (percentage >= 60) return t("messages.notBad");
    return t("messages.keepPracticing");
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-[var(--color-success)]";
    if (percentage >= 80) return "text-[var(--color-success)]";
    if (percentage >= 70) return "text-[var(--color-warning)]";
    if (percentage >= 60) return "text-[var(--color-info)]";
    return "text-[var(--color-error)]";
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-8 text-center mb-8"
          >
            {/* Score Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <div className="w-20 h-20 rounded-full border-4 border-[var(--color-success)] flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-[var(--color-success)]" />
              </div>
            </motion.div>

            {/* Message */}
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
              {getMessage(percentage)}
            </h1>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              {t("sessionComplete")}
            </p>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <p className={`text-6xl font-bold ${getScoreColor(percentage)} mb-2`}>
                {percentage}%
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                {t("cardsMastered", { known, total })}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleContinue}
                className="px-6 py-2 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                {t("continue")}
              </button>
              <button
                onClick={handleRetry}
                className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {t("tryAgain")}
              </button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          >
            {[
              { label: tStudy("cardsKnown"), value: known, icon: Check, color: "text-[var(--color-success)]" },
              { label: tStudy("needStudy"), value: studied, icon: Layers, color: "text-[var(--color-warning)]" },
              { label: tStudy("successRate"), value: `${percentage}%`, icon: TrendingUp, color: "text-[var(--color-warning)]" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-4 text-center"
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-xs text-[var(--color-muted)] mb-2">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Breakdown Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              {t("studyBreakdown.title")}
            </h2>
            <div className="space-y-3">
              {[
                { label: t("studyBreakdown.cardsMastered"), value: known, color: "bg-[var(--color-success)]" },
                { label: t("studyBreakdown.cardsToReview"), value: studied, color: "bg-[var(--color-warning)]" },
              ].map((item, idx) => {
                const percentage = total > 0 ? (item.value / total) * 100 : 0;
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-[var(--color-muted)]">{item.label}</span>
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {item.value}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.6 + idx * 0.1, duration: 0.8 }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {t("tips.title")}
            </h2>
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
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 sm:px-6 sm:py-2 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              {t("backToHome")}
            </button>
            <button
              onClick={() => router.push("/flashcards")}
              className="px-6 py-2 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center"
            >
              {t("studyMoreSets")}
            </button>
          </motion.div>
        </div>
      </main>
    </>
  );
}
