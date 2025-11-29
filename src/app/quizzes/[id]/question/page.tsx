"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

const MOCK_QUIZ = {
  id: "1",
  title: "Introduction to Machine Learning",
  subject: "Computer Science",
  totalQuestions: 4,
  currentQuestion: 1,
  questions: [
    {
      id: "q1",
      text: "What is machine learning?",
      options: [
        "A type of computer hardware",
        "A subset of AI that learns from data",
        "A programming language",
        "A database system",
      ],
      correctAnswer: 1,
    },
    {
      id: "q2",
      text: "Which of the following is a supervised learning algorithm?",
      options: [
        "K-means clustering",
        "Principal Component Analysis",
        "Linear Regression",
        "DBSCAN",
      ],
      correctAnswer: 2,
    },
    {
      id: "q3",
      text: "What does overfitting mean?",
      options: [
        "The model learns too well from training data",
        "The model fails to learn patterns",
        "The model is too simple",
        "The model has too many features",
      ],
      correctAnswer: 0,
    },
    {
      id: "q4",
      text: "Which metric is commonly used to evaluate classification models?",
      options: ["Mean Absolute Error", "Accuracy", "R-squared", "Covariance"],
      correctAnswer: 1,
    },
  ],
};

export default function QuizQuestionPage() {
  const router = useRouter();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(MOCK_QUIZ.questions.length).fill(null)
  );
  const [answered, setAnswered] = useState(false);

  const currentQuestion = MOCK_QUIZ.questions[currentQuestionIdx];
  const isAnswered = selectedAnswers[currentQuestionIdx] !== null;
  const isCorrect =
    selectedAnswers[currentQuestionIdx] === currentQuestion.correctAnswer;

  const handleSelectAnswer = (index: number) => {
    if (!answered) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestionIdx] = index;
      setSelectedAnswers(newAnswers);
      setAnswered(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < MOCK_QUIZ.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setAnswered(false);
    } else {
      // Quiz completed
      router.push("/quizzes/results");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
      setAnswered(selectedAnswers[currentQuestionIdx - 1] !== null);
    }
  };

  const progressPercentage =
    ((currentQuestionIdx + 1) / MOCK_QUIZ.questions.length) * 100;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-1">
                  {MOCK_QUIZ.title}
                </h1>
                <p className="text-sm text-[var(--color-muted)]">
                  {MOCK_QUIZ.subject}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--color-muted)] mb-1">Question</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">
                  {currentQuestionIdx + 1} / {MOCK_QUIZ.totalQuestions}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-[var(--color-primary)]"
              />
            </div>
          </motion.div>

          {/* Question Container */}
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6 sm:p-8 mb-8"
          >
            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-8">
              {currentQuestion.text}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestionIdx] === index;
                const showCorrect =
                  answered && index === currentQuestion.correctAnswer;
                const showIncorrect =
                  answered &&
                  isSelected &&
                  index !== currentQuestion.correctAnswer;

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={answered}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      showCorrect
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : showIncorrect
                          ? "bg-red-500/20 border-red-500 text-red-400"
                          : isSelected
                            ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-text)]"
                            : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]/50"
                    } ${answered ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}
                      {showIncorrect && (
                        <div className="w-5 h-5 rounded-full border-2 border-red-400 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback Message */}
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg ${
                  isCorrect
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                <p className="font-medium text-sm">
                  {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                </p>
                <p className="text-xs mt-1 opacity-80">
                  {isCorrect
                    ? "Great job! You selected the right answer."
                    : `The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIdx === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {/* Question Indicators */}
              <div className="flex gap-1 px-4">
                {MOCK_QUIZ.questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx <= currentQuestionIdx
                        ? idx === currentQuestionIdx
                          ? "bg-[var(--color-primary)] w-3"
                          : "bg-[var(--color-primary)]/50"
                        : "bg-[var(--color-border)]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!answered}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIdx === MOCK_QUIZ.questions.length - 1
                ? "Finish"
                : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
