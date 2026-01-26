"use client";

import Header from "@/components/layout/Header";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
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
  user?: { id: string; email: string };
}

interface ShuffledOption {
  opt: any;
  originalIdx: number;
}

interface ShuffledQuestion extends QuizQuestion {
  originalCorrectAnswerIndex: number; // index in shuffledOptions
  shuffledOptions: ShuffledOption[]; // keeps mapping to original indices
}

export default function QuizPage() {
  const t = useTranslations("quizzes");
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Helper function to get option text and image
  const getOptionData = (option: any): { text: string; image?: string } => {
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
  const getCorrectAnswerIndex = (q: QuizQuestion): number => {
    const parsed = parseInt(q.correctAnswer, 10);
    // If it's a valid number and within range, use it
    if (!isNaN(parsed) && parsed >= 0 && parsed < q.options.length) {
      return parsed;
    }
    // Otherwise, try to find the option that matches the correctAnswer text
    const index = q.options.findIndex((opt) => {
      const optText = getOptionData(opt).text;
      return optText === q.correctAnswer;
    });
    return index >= 0 ? index : 0; // Default to 0 if not found
  };

  // Helper function to shuffle options for a single question
  const shuffleQuestionOptions = (q: QuizQuestion): ShuffledQuestion => {
    const correctIdx = getCorrectAnswerIndex(q);
    const optionsWithIndices = q.options.map((opt, idx) => ({ opt, originalIdx: idx }));
    const shuffled = [...optionsWithIndices];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Find new index of the originally correct answer
    const newCorrectIdx = shuffled.findIndex((item) => item.originalIdx === correctIdx);

    return {
      ...q,
      options: shuffled.map((item) => item.opt),
      shuffledOptions: shuffled,
      originalCorrectAnswerIndex: newCorrectIdx >= 0 ? newCorrectIdx : 0,
    };
  };

  // Helper function to shuffle array order (Fisher-Yates)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/quizzes/${quizId}`);
        if (!response.ok) throw new Error("Failed to fetch quiz");

        const data: QuizData = await response.json();
        
        setQuiz(data);
        // Shuffle options for all questions, then shuffle the order of questions
        const shuffledOptions = data.questions.map((q) => shuffleQuestionOptions(q));
        const shuffledOrder = shuffleArray(shuffledOptions);
        setShuffledQuestions(shuffledOrder);
        setQuestionOrder(shuffledOrder.map((q) => q.id));
        setError(null);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz");
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quiz && !isLoading) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quiz, isLoading]);

  // Re-shuffle options when current question changes
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      const current = shuffledQuestions[currentQuestion];
      if (current && quiz) {
        const originalQuestion = quiz.questions.find((q) => q.id === current.id);
        if (originalQuestion) {
          const reshuffled = shuffleQuestionOptions(originalQuestion);
          const updated = [...shuffledQuestions];
          updated[currentQuestion] = reshuffled;
          setShuffledQuestions(updated);
        }
      }
    }
  }, [currentQuestion]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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

  if (!quiz.questions || quiz.questions.length === 0) {
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
              This quiz has no questions
            </div>
          </div>
        </main>
      </>
    );
  }

  const question = shuffledQuestions[currentQuestion] || quiz.questions[currentQuestion];
  const originalQuestion = quiz.questions.find((q) => q.id === question.id) ?? question;
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === -1) return;

    const current = shuffledQuestions[currentQuestion];
    const selectedOriginalIndex = current?.shuffledOptions?.[selectedAnswer]?.originalIdx ?? selectedAnswer;

    setAnswers((prev) => ({
      ...prev,
      [current.id]: selectedOriginalIndex,
    }));
    setShowFeedback(true);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const params = new URLSearchParams();
      params.set("answers", encodeURIComponent(JSON.stringify(answers)));
      params.set("time", String(timeElapsed));
      if (questionOrder.length) {
        params.set("order", encodeURIComponent(JSON.stringify(questionOrder)));
      }
      router.push(`/quizzes/${quizId}/results?${params.toString()}`);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(-1);
      setShowFeedback(false);
      setIsAnswered(false);
    }
  };

  const correctAnswerOriginalIndex = getCorrectAnswerIndex(originalQuestion);
  const correctAnswerShuffledIndex = (() => {
    const idx = (question as ShuffledQuestion).shuffledOptions?.findIndex(
      (opt) => opt.originalIdx === correctAnswerOriginalIndex
    );
    return idx !== undefined && idx >= 0 ? idx : correctAnswerOriginalIndex;
  })();
  const isCorrect =
    selectedAnswer !== -1 &&
    (question as ShuffledQuestion).shuffledOptions?.[selectedAnswer]?.originalIdx === correctAnswerOriginalIndex;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button and Actions */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("tabs.allQuizzes")}
            </Link>
          </div>

          {/* Quiz Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">
              {quiz.title}
            </h1>
            <p className="text-sm text-[var(--color-muted)] mb-4">{quiz.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-muted)]">
                {t("questionPage.question")} {currentQuestion + 1} / {quiz.totalQuestions}
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--color-muted)]" />
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    {formatTime(timeElapsed)}
                  </span>
                </div>
                <span className="text-lg font-bold text-[var(--color-primary)]">
                  {currentQuestion + 1} / {quiz.totalQuestions}
                </span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-[var(--color-bg-light)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / quiz.totalQuestions) * 100}%` }}
                className="h-full bg-[var(--color-primary)]"
              />
            </div>
          </motion.div>

          {/* Question */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl p-6 mb-8"
          >
            {/* Question Image */}
            {question.questionImage && (
              <img
                src={question.questionImage}
                alt="Question"
                className="w-full h-auto rounded-lg mb-4 max-h-96 object-cover"
              />
            )}
            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-text)] mb-6">
              {question.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => {
                const optionData = getOptionData(option);
                const isSelected = selectedAnswer === index;
                const isCorrectOption = index === (correctAnswerShuffledIndex ?? -1);
                const showCorrect = showFeedback && isCorrectOption;
                const showIncorrect = showFeedback && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={index}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className={`w-full p-4 text-left rounded-xl border-2 transition ${
                      showCorrect
                        ? "bg-[var(--color-success)]/20 border-[var(--color-success)] text-[var(--color-success)]"
                        : showIncorrect
                          ? "bg-[var(--color-error)]/20 border-[var(--color-error)] text-[var(--color-error)]"
                          : isSelected
                            ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)]"
                            : "bg-[var(--color-bg-light)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
                    } ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="space-y-2">
                      {optionData.image && (
                        <div className="flex justify-center">
                          <img
                            src={optionData.image}
                            alt={optionData.text}
                            className="rounded max-w-full h-auto max-h-40 object-contain"
                          />
                        </div>
                      )}
                      {optionData.text && <div>{optionData.text}</div>}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg mb-6 ${
                  isCorrect
                    ? "bg-[var(--color-success)]/20 border border-[var(--color-success)] text-[var(--color-success)]"
                    : "bg-[var(--color-error)]/20 border border-[var(--color-error)] text-[var(--color-error)]"
                }`}
              >
                <p className="font-semibold mb-2">
                  {isCorrect ? t("questionPage.correct") : t("questionPage.incorrect")}
                </p>
                <p>
                  {isCorrect
                    ? t("questionPage.correctFeedback")
                    : `${t("questionPage.incorrectFeedback")} ${getOptionData(originalQuestion.options[correctAnswerOriginalIndex]).text}`}
                </p>
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              {!isAnswered ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === -1}
                  className="flex-1 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition font-medium disabled:opacity-50"
                >
                  {t("questionPage.next")}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition font-medium"
                >
                  {isLastQuestion ? t("questionPage.finish") : t("questionPage.next")}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
