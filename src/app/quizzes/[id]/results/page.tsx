"use client";

import Header from "@/components/layout/Header";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  FileText,
  LayoutDashboard,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

interface QuizQuestion {
  id: string;
  question: string;
  questionImage?: string;
  options: string[];
  correctAnswer: string; // Stored as string in database
}

interface QuizData {
  id: string;
  title: string;
  description?: string;
  totalQuestions: number;
  questions: QuizQuestion[];
  createdAt: string;
  userId: string;
}

export default function ResultsPage() {
  const t = useTranslations("quizzes");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = params.id as string;
  const answersParam = searchParams.get("answers");
  const orderParam = searchParams.get("order");
  const timeParam = searchParams.get("time");
  const timeElapsed = timeParam ? parseInt(timeParam) : 0;

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [orderedQuestions, setOrderedQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [isSharing, setIsSharing] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleQuestion = (index: number) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getOptionData = (option: any) => {
    // Handle undefined or null
    if (!option) {
      return { text: '', image: undefined };
    }
    
    // If it's an object with text and image properties, return it directly
    if (typeof option === 'object' && option !== null && typeof option.text !== 'undefined') {
      return { text: option.text || '', image: option.image };
    }
    
    // If it's a string, try to parse as JSON
    if (typeof option === 'string') {
      try {
        const parsed = JSON.parse(option);
        // Only treat as JSON object if it has a text property
        if (typeof parsed === 'object' && parsed !== null && 'text' in parsed) {
          return { text: parsed.text || '', image: parsed.image };
        }
        // If parsed but not a text object, treat original string as plain text
        return { text: option, image: undefined };
      } catch {
        // JSON parse failed, treat as plain text
        return { text: option, image: undefined };
      }
    }
    
    return { text: '', image: undefined };
  };

  // Helper function to resolve correctAnswer to index
  // Handles both index strings ("0", "1") and actual answer text
  const getCorrectAnswerIndex = (q: any, options: any[]): number => {
    const parsed = parseInt(q.correctAnswer, 10);
    // If it's a valid number and within range, use it
    if (!isNaN(parsed) && parsed >= 0 && parsed < options.length) {
      return parsed;
    }
    // Otherwise, try to find the option that matches the correctAnswer text
    const index = options.findIndex((opt) => {
      const optText = getOptionData(opt).text;
      return optText === q.correctAnswer;
    });
    return index >= 0 ? index : 0; // Default to 0 if not found
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/quizzes/${quizId}`);
        if (!response.ok) throw new Error("Failed to fetch quiz");

        const data: QuizData = await response.json();

        // Normalize options and convert correctAnswer to index
        const normalizedQuiz = {
          ...data,
          questions: data.questions.map((q: any) => {
            const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
            // Use helper to resolve correctAnswer - handles both index strings and text values
            const correctAnswerIndex = getCorrectAnswerIndex(q, options);
            return {
              ...q,
              options,
              correctAnswer: correctAnswerIndex,
            };
          }),
        };

        // Restore order of questions if provided (to match solving sequence)
        let orderedList: QuizQuestion[] = normalizedQuiz.questions;
        if (orderParam) {
          try {
            const parsedOrder = JSON.parse(decodeURIComponent(orderParam));
            if (Array.isArray(parsedOrder) && parsedOrder.length > 0) {
              const mapped = parsedOrder
                .map((id: string) => normalizedQuiz.questions.find((q) => q.id === id))
                .filter(Boolean) as QuizQuestion[];
              if (mapped.length > 0) {
                orderedList = mapped;
              }
            }
          } catch (e) {
            console.error("Failed to parse order:", e);
          }
        }

        setQuiz({ ...normalizedQuiz, questions: normalizedQuiz.questions });
        setOrderedQuestions(orderedList);

        // Parse answers from query param (supports both id-keyed and legacy index arrays)
        if (answersParam) {
          try {
            const parsed = JSON.parse(decodeURIComponent(answersParam));

            if (Array.isArray(parsed)) {
              const mapped: Record<string, number> = {};
              normalizedQuiz.questions.forEach((q, idx) => {
                if (parsed[idx] !== undefined && parsed[idx] !== null) {
                  mapped[q.id] = Number(parsed[idx]);
                }
              });
              setAnswers(mapped);
            } else if (parsed && typeof parsed === "object") {
              const normalized: Record<string, number> = {};
              Object.entries(parsed).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                  normalized[key] = Number(value);
                }
              });
              setAnswers(normalized);
            }
          } catch (e) {
            console.error("Failed to parse answers:", e);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(t("results.failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId, answersParam, orderParam]);

  // Calculate score early (before early returns)
  const questionsForDisplay = orderedQuestions.length > 0 ? orderedQuestions : quiz?.questions ?? [];
  const totalQuestionsCount = questionsForDisplay.length || quiz?.totalQuestions || 0;
  const totalAnswered = questionsForDisplay.filter((q) => answers[q.id] !== undefined && answers[q.id] !== null).length;

  const correctCount = questionsForDisplay.reduce((count, question) => {
    const userAnswer = answers[question.id];
    const correctAnswerNum = typeof question.correctAnswer === "number"
      ? question.correctAnswer
      : parseInt(question.correctAnswer as unknown as string, 10);
    const isCorrect = userAnswer !== undefined && userAnswer === correctAnswerNum;
    return count + (isCorrect ? 1 : 0);
  }, 0);

  const percentage = totalQuestionsCount > 0 ? Math.round((correctCount / totalQuestionsCount) * 100) : 0;
  const incorrectCount = totalQuestionsCount - correctCount;

  // Save score to database - moved before early returns
  useEffect(() => {
    if (percentage >= 0 && quiz) {
      const saveScore = async () => {
        try {
          await fetch(`/api/quizzes/${quizId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score: percentage }),
          });
        } catch (error) {
          console.error("Failed to save score:", error);
        }
      };
      saveScore();
    }
  }, [quizId, percentage, quiz]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <p className="text-[var(--color-muted)]">{t("loading")}</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !quiz) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("tabs.allQuizzes")}
            </Link>
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400">
              {error || "Quiz not found"}
            </div>
          </div>
        </main>
      </>
    );
  }

  // Determine message based on score
  const getMessage = () => {
    if (percentage >= 80) return t("results.messages.excellent");
    if (percentage >= 60) return t("results.messages.goodWork");
    if (percentage >= 40) return t("results.messages.notBad");
    return t("results.messages.tryAgain");
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
            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl p-8 mb-6 text-center"
          >
            {/* Trophy Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
            </div>

            {/* Message */}
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
              {getMessage()}
            </h1>
            <p className="text-[var(--color-muted)] mb-1">{quiz.title}</p>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              {quiz.description || "Quiz"}
            </p>

            {/* Big Percentage */}
            <div className="text-6xl font-bold text-[var(--color-primary)] mb-2">
              {percentage}%
            </div>
            <p className="text-[var(--color-muted)] mb-8">
              {correctCount} z {quiz.totalQuestions} {t("results.correctAnswersLabel")}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={`/quizzes/${quizId}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                {t("results.retakeQuiz")}
              </Link>
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-light)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-bg-darker)] transition font-medium"
              >
                <FileText className="w-4 h-4" />
                {t("results.viewNotes")}
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-light)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-bg-darker)] transition font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                {t("results.dashboard")}
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
            {/* Correct Answers */}
            <div className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl p-4">
              <div className="flex items-center gap-2 text-[var(--color-muted)] mb-2">
                <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                <span className="text-sm">{t("results.correct")}</span>
              </div>
              <p className="text-3xl font-bold text-[var(--color-success)]">
                {correctCount}
              </p>
            </div>

            {/* Incorrect Answers */}
            <div className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl p-4">
              <div className="flex items-center gap-2 text-[var(--color-muted)] mb-2">
                <XCircle className="w-4 h-4 text-[var(--color-error)]" />
                <span className="text-sm">{t("results.incorrect")}</span>
              </div>
              <p className="text-3xl font-bold text-[var(--color-error)]">
                {incorrectCount}
              </p>
            </div>

            {/* Time Spent */}
            <div className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl p-4">
              <div className="flex items-center gap-2 text-[var(--color-muted)] mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{t("results.time")}</span>
              </div>
              <p className="text-3xl font-bold text-[var(--color-text)]">{formatTime(timeElapsed)}</p>
            </div>
          </motion.div>

          {/* Performance Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {t("results.performanceAnalysis")}
              </h2>
            </div>
            <p className="text-sm text-[var(--color-muted)] mb-4">
              {t("results.detailedAnalysis")}
            </p>

            {/* Accuracy Rate */}
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--color-muted)]">{t("results.accuracy")}</span>
                <span className="text-[var(--color-primary)] font-medium">
                  {percentage}%
                </span>
              </div>
              <div className="h-2 bg-[var(--color-bg-light)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-[var(--color-primary)]"
                />
              </div>
            </div>
          </motion.div>

          {/* Review Your Answers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {t("results.reviewAnswers")}
                </h2>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questionsForDisplay.map((question, qIndex) => {
                const userAnswerIndex = answers[question.id];
                const userAnswer =
                  userAnswerIndex !== undefined
                    ? question.options[userAnswerIndex]
                    : null;
                // correctAnswer is already normalized to a number in useEffect
                let correctAnswerIndex = typeof question.correctAnswer === 'number'
                  ? question.correctAnswer
                  : parseInt(question.correctAnswer as unknown as string, 10);
                
                // Handle NaN case - should not happen if normalization worked
                if (isNaN(correctAnswerIndex)) {
                  console.warn(`Invalid correctAnswer for question ${qIndex}:`, question.correctAnswer);
                  correctAnswerIndex = 0;
                }
                
                const correctAnswer = question.options[correctAnswerIndex];
                const isCorrect = userAnswerIndex !== undefined && userAnswerIndex === correctAnswerIndex;
                const isExpanded = expandedQuestions.has(qIndex);
                
                // Debug logging
                console.log(`Question ${qIndex}:`, {
                  userAnswerIndex,
                  correctAnswerIndex,
                  isCorrect,
                  correctAnswer,
                  correctAnswerText: getOptionData(correctAnswer)
                });

                return (
                  <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + qIndex * 0.05 }}
                    className={`border border-[var(--color-primary)] rounded-xl overflow-hidden ${
                      isCorrect
                        ? "bg-[var(--color-success)]/5"
                        : "bg-[var(--color-error)]/5"
                    }`}
                  >
                    {/* Question Header */}
                    <div className="p-4 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCorrect
                              ? "bg-[var(--color-success)]/20"
                              : "bg-[var(--color-error)]/20"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[var(--color-error)]" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-[var(--color-text)]">
                            {t("results.question")} {qIndex + 1}: {question.question}
                          </h3>
                          {question.questionImage && (
                            <img
                              src={question.questionImage}
                              alt="Question"
                              className="mt-2 rounded-lg max-h-64 max-w-md object-cover"
                            />
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          isCorrect
                            ? "bg-[var(--color-success)]/20 text-[var(--color-success)]"
                            : "bg-[var(--color-error)]/20 text-[var(--color-error)]"
                        }`}
                      >
                        {isCorrect ? t("results.correct") : t("results.incorrect")}
                      </span>
                    </div>

                    {/* Answer Details */}
                    <div className="px-4 pb-4 pl-15">
                      <div className="ml-11 space-y-3">
                        {/* User's answer */}
                        <div className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-3">
                          <p className="text-xs text-[var(--color-muted)] mb-1">
                            {t("results.yourAnswer")}
                          </p>
                          {userAnswer ? (
                            <div
                              className={`font-medium ${
                                isCorrect
                                  ? "text-[var(--color-success)]"
                                  : "text-[var(--color-error)]"
                              }`}
                            >
                              {getOptionData(userAnswer).image && (
                                <div className="flex justify-center mb-2">
                                  <img
                                    src={getOptionData(userAnswer).image}
                                    alt="User's answer"
                                    className="rounded max-w-full h-auto max-h-40 object-contain"
                                  />
                                </div>
                              )}
                              {getOptionData(userAnswer).text && (
                                <p>{getOptionData(userAnswer).text}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[var(--color-muted)]">{t("results.noAnswer")}</p>
                          )}
                        </div>

                        {/* Correct answer (if wrong) */}
                        {!isCorrect && correctAnswer !== undefined && (
                          <div className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-3">
                            <p className="text-xs text-[var(--color-muted)] mb-1">
                              {t("results.correctAnswer")}
                            </p>
                            <div className="font-medium text-[var(--color-success)]">
                              {getOptionData(correctAnswer).image && (
                                <div className="flex justify-center mb-2">
                                  <img
                                    src={getOptionData(correctAnswer).image}
                                    alt="Correct answer"
                                    className="rounded max-w-full h-auto max-h-40 object-contain"
                                  />
                                </div>
                              )}
                              {getOptionData(correctAnswer).text && (
                                <p>{getOptionData(correctAnswer).text}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Expandable explanation */}
                        <button
                          onClick={() => toggleQuestion(qIndex)}
                          className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                          Wyjaśnienie
                        </button>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-3"
                          >
                            <p className="text-sm text-[var(--color-muted)]">
                              Poprawna odpowiedź to:{" "}
                              <span className="text-[var(--color-success)]">
                                {correctAnswer}
                              </span>
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
