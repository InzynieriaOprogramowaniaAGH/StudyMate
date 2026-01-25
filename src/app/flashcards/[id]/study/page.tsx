"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { ChevronLeft, Volume2, RotateCcw, Check, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  frontImage?: string | null;
  backImage?: string | null;
  createdAt: string;
}

interface FlashcardSetStudy {
  id: string;
  title: string;
  noteTitle: string;
  cards: Flashcard[];
  cardCount: number;
}

export default function FlashcardStudyPage() {
  const router = useRouter();
  const params = useParams();
  const setId = params.id as string;
  const t = useTranslations("flashcards.studyPage");
  
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSetStudy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Study queue - cards that still need to be reviewed
  const [studyQueue, setStudyQueue] = useState<Flashcard[]>([]);
  // Cards marked as known
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  // Cards marked for review (will be reshuffled)
  const [reviewCards, setReviewCards] = useState<Set<string>>(new Set());
  // Total cards in set (for stats)
  const [totalCards, setTotalCards] = useState(0);
  // Timer for tracking study time
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/flashcards/${setId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch flashcard set");
        }
        const data = await response.json();
        setFlashcardSet(data);
        setStudyQueue([...data.cards]);
        setTotalCards(data.cards.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (setId) {
      fetchFlashcardSet();
    }
  }, [setId]);

  // Save reviewed cards when study is complete
  useEffect(() => {
    const saveReviewedCards = async () => {
      if (studyQueue.length === 0 && knownCards.size > 0 && flashcardSet) {
        // Save known cards as reviewed
        const knownCardIds = Array.from(knownCards);
        const reviewCardIds = Array.from(reviewCards);
        
        try {
          // Save known cards with 'known' flag
          if (knownCardIds.length > 0) {
            await fetch("/api/flashcards/review", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cardIds: knownCardIds, known: true }),
            });
          }
          
          // Save review cards (studied but not known)
          if (reviewCardIds.length > 0) {
            await fetch("/api/flashcards/review", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cardIds: reviewCardIds, known: false }),
            });
          }
        } catch (error) {
          console.error("Failed to save review progress:", error);
        }
        
        router.push(`/flashcards/${flashcardSet.id}/results?known=${knownCards.size}&studied=${reviewCards.size}&time=${timeElapsed}`);
      }
    };
    
    saveReviewedCards();
  }, [studyQueue.length, knownCards.size, reviewCards.size, flashcardSet, router, knownCards, reviewCards, timeElapsed]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            <p className="text-[var(--color-muted)]">{t("loading") || "Loading..."}</p>
          </div>
        </main>
      </>
    );
  }

  // Error state
  if (error || !flashcardSet) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-[var(--color-error)] mx-auto mb-4" />
            <p className="text-[var(--color-error)]">{error || "Flashcard set not found"}</p>
            <button
              onClick={() => router.push("/flashcards")}
              className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
            >
              {t("backToFlashcards")}
            </button>
          </div>
        </main>
      </>
    );
  }

  if (studyQueue.length === 0 && knownCards.size > 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            <p className="text-[var(--color-muted)]">Completing...</p>
          </div>
        </main>
      </>
    );
  }

  // Current card is the first card in the queue
  const currentCard = studyQueue.length > 0 ? studyQueue[0] : null;
  const progress = ((knownCards.size) / totalCards) * 100;

  const handleKnow = () => {
    if (!currentCard) return;
    
    // Add to known cards
    const newKnown = new Set(knownCards);
    newKnown.add(currentCard.id);
    setKnownCards(newKnown);
    
    // Remove from review if it was there
    const newReview = new Set(reviewCards);
    newReview.delete(currentCard.id);
    setReviewCards(newReview);
    
    // Remove from queue
    const newQueue = studyQueue.slice(1);
    setStudyQueue(newQueue);
    setIsFlipped(false);
  };

  const handleNeedStudy = () => {
    if (!currentCard) return;
    
    // Add to review cards
    const newReview = new Set(reviewCards);
    newReview.add(currentCard.id);
    setReviewCards(newReview);
    
    // Move card to end of queue
    const newQueue = [...studyQueue.slice(1), currentCard];
    setStudyQueue(newQueue);
    setIsFlipped(false);
  };

  const handleRestart = () => {
    setStudyQueue([...flashcardSet.cards]);
    setKnownCards(new Set());
    setReviewCards(new Set());
    setIsFlipped(false);
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window && currentCard) {
      // Only speak text content, not images
      const textToSpeak = isFlipped ? currentCard.back : currentCard.front;
      if (textToSpeak) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Handle case where queue is empty but we have no known cards
  if (!currentCard) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
          <div className="text-center">
            <p className="text-[var(--color-muted)]">No cards to study</p>
            <button
              onClick={() => router.push("/flashcards")}
              className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
            >
              {t("backToFlashcards")}
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/flashcards")}
            className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("backToFlashcards")}
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">
                  {flashcardSet.title}
                </h1>
                <p className="text-sm text-[var(--color-muted)]">
                  {flashcardSet.noteTitle}
                </p>
              </div>
              <span className="text-sm text-[var(--color-muted)]">
                {t("known") || "Known"}
                <br />
                <span className="text-xl font-bold text-[var(--color-text)]">
                  {knownCards.size} / {totalCards}
                </span>
              </span>
            </div>

            {/* Progress Bar - shows how many cards are known */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-[var(--color-primary)] rounded-full"
              />
            </div>
          </motion.div>

          {/* Flashcard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 flex flex-col mb-6"
          >
            <motion.div
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex-1 relative cursor-pointer min-h-[400px] bg-slate-900/50 border border-slate-800 rounded-xl p-8 flex items-center justify-center"
              style={{
                perspective: "1000px",
              }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                initial={false}
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.6 }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="w-full h-full flex items-center justify-center"
              >
                {/* Front of Card */}
                <motion.div
                  style={{
                    backfaceVisibility: "hidden",
                  }}
                  className="w-full h-full flex flex-col items-center justify-center text-center"
                >
                  <p className="text-xs text-[var(--color-muted)] mb-2 uppercase tracking-wider font-medium">
                    {t("question")}
                  </p>
                  {currentCard.frontImage ? (
                    <img
                      src={currentCard.frontImage}
                      alt="Front"
                      className="max-h-80 max-w-full object-cover rounded-lg"
                    />
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] leading-relaxed">
                      {currentCard.front}
                    </p>
                  )}
                  <p className="text-xs text-[var(--color-muted)] mt-8">
                    {t("clickToReveal")}
                  </p>
                </motion.div>

                {/* Back of Card */}
                <motion.div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className="w-full h-full flex flex-col items-center justify-center text-center absolute inset-0"
                >
                  <p className="text-xs text-[var(--color-primary)] mb-2 uppercase tracking-wider font-medium">
                    {t("answer")}
                  </p>
                  {currentCard.backImage ? (
                    <img
                      src={currentCard.backImage}
                      alt="Back"
                      className="max-h-80 max-w-full object-cover rounded-lg"
                    />
                  ) : (
                    <p className="text-xl sm:text-2xl font-medium text-[var(--color-text)] leading-relaxed">
                      {currentCard.back}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Audio Button - only show if there's text content */}
            {(currentCard.front || currentCard.back) && !currentCard.frontImage && !currentCard.backImage && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSpeak}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  {t("listen")}
                </button>
              </div>
            )}
          </motion.div>

          {/* Cards remaining indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <p className="text-sm text-[var(--color-muted)]">
              {studyQueue.length} {studyQueue.length === 1 ? "card" : "cards"} remaining in this round
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            {[
              { label: t("known") || "Known", value: knownCards.size, color: "text-[var(--color-primary)]" },
              { label: t("review") || "Review", value: reviewCards.size, color: "text-[var(--color-error)]" },
              { label: t("remaining") || "Remaining", value: studyQueue.length, color: "text-[var(--color-text)]" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center"
              >
                <p className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                <p className="text-xs text-[var(--color-muted)]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-4"
          >
            {/* Restart Button */}
            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-700 text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t("restart")}
            </button>
          </motion.div>

          {/* Study Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <button
              onClick={handleKnow}
              className="w-full px-6 py-3 bg-[var(--color-success-10)] text-[var(--color-success)] font-medium rounded-lg hover:bg-[var(--color-success-20)] transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {t("iKnowThis")}
            </button>
            <button
              onClick={handleNeedStudy}
              className="w-full px-6 py-3 bg-[var(--color-warning-10)] text-[var(--color-warning)] font-medium rounded-lg hover:bg-[var(--color-warning-20)] transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              {t("needMoreStudy")}
            </button>
          </motion.div>
        </div>
      </main>
    </>
  );
}
