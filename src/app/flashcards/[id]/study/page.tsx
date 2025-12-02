"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, RotateCcw, Check, BookOpen, CheckCircle2, Layers, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  createdAt: string;
}

interface FlashcardSetStudy {
  id: string;
  title: string;
  noteTitle: string;
  difficulty: "Easy" | "Medium" | "Hard";
  cards: Flashcard[];
}

const MOCK_FLASHCARD_SET: FlashcardSetStudy = {
  id: "1",
  title: "Biology Basics",
  noteTitle: "Introduction to Biology",
  difficulty: "Easy",
  cards: [
    {
      id: "c1",
      front: "What is the basic unit of life?",
      back: "The cell is the basic unit of life. All living organisms are composed of one or more cells.",
      createdAt: "2024-01-15",
    },
    {
      id: "c2",
      front: "Define photosynthesis",
      back: "Photosynthesis is the process by which plants and other organisms convert light energy into chemical energy stored in glucose.",
      createdAt: "2024-01-15",
    },
    {
      id: "c3",
      front: "What are mitochondria?",
      back: "mitochondria to fabryka energii komorkowej, która produkuje ATP poprzez oddychanie komórkowe.",
      createdAt: "2024-01-16",
    },
    {
      id: "c4",
      front: "Explain DNA",
      back: "DNA (deoxyribonucleic acid) is a molecule that carries genetic instructions for life. It contains four bases: adenine, thymine, guanine, and cytosine.",
      createdAt: "2024-01-16",
    },
    {
      id: "c5",
      front: "What is homeostasis?",
      back: "Homeostasis is the process by which organisms maintain a stable internal environment despite external changes.",
      createdAt: "2024-01-17",
    },
  ],
};

export default function FlashcardStudyPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knowCards, setKnowCards] = useState<string[]>([]);
  const [studyCards, setStudyCards] = useState<string[]>([]);

  const currentCard = MOCK_FLASHCARD_SET.cards[currentIndex];
  const progress = ((currentIndex + 1) / MOCK_FLASHCARD_SET.cards.length) * 100;

  const handleNext = () => {
    if (currentIndex < MOCK_FLASHCARD_SET.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Study complete
      handleStudyComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleKnow = () => {
    if (!knowCards.includes(currentCard.id)) {
      setKnowCards([...knowCards, currentCard.id]);
    }
    handleNext();
  };

  const handleNeedStudy = () => {
    if (!studyCards.includes(currentCard.id)) {
      setStudyCards([...studyCards, currentCard.id]);
    }
    handleNext();
  };

  const handleStudyComplete = () => {
    // Navigate to results page
    router.push(`/flashcards/${MOCK_FLASHCARD_SET.id}/results?known=${knowCards.length}&studied=${studyCards.length}`);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnowCards([]);
    setStudyCards([]);
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        isFlipped ? currentCard.back : currentCard.front
      );
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/flashcards")}
            className="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Flashcards
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
                  {MOCK_FLASHCARD_SET.title}
                </h1>
                <p className="text-sm text-[var(--color-muted)]">
                  {MOCK_FLASHCARD_SET.noteTitle}
                </p>
              </div>
              <span className="text-sm text-[var(--color-muted)]">
                Card
                <br />
                <span className="text-xl font-bold text-[var(--color-text)]">
                  {currentIndex + 1} / {MOCK_FLASHCARD_SET.cards.length}
                </span>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-[var(--color-bg-light)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
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
              className="flex-1 relative cursor-pointer min-h-[400px] bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-8 flex items-center justify-center"
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
                  className="w-full h-full flex items-center justify-center text-center"
                >
                  <div>
                    <p className="text-xs text-[var(--color-muted)] mb-4 uppercase tracking-wider font-medium">
                      Question
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] leading-relaxed">
                      {currentCard.front}
                    </p>
                    <p className="text-xs text-[var(--color-muted)] mt-8">
                      Click to reveal answer
                    </p>
                  </div>
                </motion.div>

                {/* Back of Card */}
                <motion.div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className="w-full h-full flex items-center justify-center text-center absolute inset-0"
                >
                  <div>
                    <p className="text-xs text-[var(--color-primary)] mb-4 uppercase tracking-wider font-medium">
                      Answer
                    </p>
                    <p className="text-xl sm:text-2xl font-medium text-[var(--color-text)] leading-relaxed">
                      {currentCard.back}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Audio Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSpeak}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-light)] border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Listen
              </button>
            </div>
          </motion.div>

          {/* Navigation Dots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-2 mb-4"
          >
            {MOCK_FLASHCARD_SET.cards.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsFlipped(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-8 h-8 rounded-full font-medium text-xs transition-colors ${
                  idx === currentIndex
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-light)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]"
                }`}
              >
                {idx + 1}
              </motion.button>
            ))}
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            {[
              { label: "Cards Known", value: knowCards.length, icon: CheckCircle2, color: "text-emerald-400" },
              { label: "Need Study", value: studyCards.length, icon: Layers, color: "text-orange-400" },
              { label: "Success Rate", value: `${Math.round((knowCards.length / (knowCards.length + studyCards.length)) * 100) || 0}%`, icon: AlertCircle, color: "text-yellow-400" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-4 text-center"
                >
                  <div className="rounded-full w-8 h-8 flex items-center justify-center bg-[var(--color-primary)]/10 mx-auto mb-2">
                    <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <p className="text-xs text-[var(--color-muted)] mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 justify-between mb-4"
          >
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Restart Button */}
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Study Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-2 gap-3"
          >
            <button
              onClick={handleKnow}
              className="w-full px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-medium rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              I Know This
            </button>
            <button
              onClick={handleNeedStudy}
              className="w-full px-6 py-3 bg-orange-500/20 border border-orange-500/30 text-orange-400 font-medium rounded-lg hover:bg-orange-500/30 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Need More Study
            </button>
          </motion.div>
        </div>
      </main>
    </>
  );
}
