"use client";

import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Share2, RotateCcw, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface QuizResult {
  quizTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: string;
  improvement: number;
  questions: Array<{
    id: string;
    text: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

const MOCK_RESULT: QuizResult = {
  quizTitle: "Introduction to Machine Learning",
  subject: "Computer Science",
  score: 75,
  totalQuestions: 4,
  correctAnswers: 3,
  timeSpent: "12:34",
  improvement: 15,
  questions: [
    {
      id: "q1",
      text: "What is machine learning?",
      userAnswer: "A subset of AI that learns from data",
      correctAnswer: "A subset of AI that learns from data",
      isCorrect: true,
    },
    {
      id: "q2",
      text: "Which of the following is a supervised learning algorithm?",
      userAnswer: "Principal Component Analysis",
      correctAnswer: "Linear Regression",
      isCorrect: false,
    },
    {
      id: "q3",
      text: "What does overfitting mean?",
      userAnswer: "The model learns too well from training data",
      correctAnswer: "The model learns too well from training data",
      isCorrect: true,
    },
    {
      id: "q4",
      text: "Which metric is commonly used to evaluate classification models?",
      userAnswer: "Accuracy",
      correctAnswer: "Accuracy",
      isCorrect: true,
    },
  ],
};

export default function QuizResultsPage() {
  const router = useRouter();
  const exportCardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    try {
      if (!exportCardRef.current) {
        alert("Export card not found");
        return;
      }

      // Dynamic import of html2canvas
      const html2canvas = (await import("html2canvas")).default;
      
      const canvas = await html2canvas(exportCardRef.current, {
        backgroundColor: "#040609",
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `quiz-result-${MOCK_RESULT.score}%.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

        }
      });
    } catch (error) {
      console.error("Error sharing result:", error);
      alert("Error exporting result. Please try again.");
    }
  };

  const handleRetake = () => {
    router.push(`/quizzes/1/question`);
  };

  const handleContinue = () => {
    router.push("/quizzes");
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent!";
    if (score >= 80) return "Great Job!";
    if (score >= 70) return "Good Work!";
    if (score >= 60) return "Not Bad!";
    return "Keep Practicing!";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-emerald-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Results Card - For Display Only */}
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
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            </motion.div>

            {/* Message */}
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
              {getScoreMessage(MOCK_RESULT.score)}
            </h1>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              {MOCK_RESULT.quizTitle}
            </p>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <p className={`text-6xl font-bold ${getScoreColor(MOCK_RESULT.score)} mb-2`}>
                {MOCK_RESULT.score}%
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                {MOCK_RESULT.correctAnswers} out of {MOCK_RESULT.totalQuestions} correct
              </p>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={handleContinue}
                className="px-6 py-2 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Continue
              </button>
              <button 
                onClick={handleShare}
                className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button 
                onClick={handleRetake}
                className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake
              </button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: "Correct Answers", value: MOCK_RESULT.correctAnswers, icon: "✓" },
              { label: "Incorrect Answers", value: MOCK_RESULT.totalQuestions - MOCK_RESULT.correctAnswers, icon: "✕" },
              { label: "Time Spent", value: MOCK_RESULT.timeSpent, icon: "⏱" },
              { label: "Improvement", value: `+${MOCK_RESULT.improvement}%`, icon: "📈" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-4 text-center"
              >
                <p className="text-xs text-[var(--color-muted)] mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Performance Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Performance Breakdown
            </h2>
            <div className="space-y-3">
              {[
                { label: "Mastered", value: MOCK_RESULT.correctAnswers, color: "bg-emerald-500" },
                { label: "Struggling", value: MOCK_RESULT.totalQuestions - MOCK_RESULT.correctAnswers, color: "bg-red-500" },
              ].map((item, idx) => {
                const percentage = (item.value / MOCK_RESULT.totalQuestions) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-[var(--color-muted)]">{item.label}</span>
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {percentage.toFixed(0)}%
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

          {/* Export Card for Sharing */}
          <motion.div
            ref={exportCardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-8 mb-8"
            style={{ position: "absolute", left: "-9999px", width: "600px" }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <p className={`text-4xl font-bold ${getScoreColor(MOCK_RESULT.score)} mb-2`}>
                {MOCK_RESULT.score}%
              </p>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-1">
                {MOCK_RESULT.quizTitle}
              </h3>
              <p className="text-sm text-[var(--color-muted)]">
                {MOCK_RESULT.correctAnswers} out of {MOCK_RESULT.totalQuestions} correct
              </p>
            </div>

            {/* Questions Summary */}
            <div className="space-y-3 mb-6">
              {MOCK_RESULT.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`border-l-4 p-3 rounded ${
                    q.isCorrect
                      ? "border-l-emerald-500 bg-emerald-500/5"
                      : "border-l-red-500 bg-red-500/5"
                  }`}
                >
                  <p className="text-xs font-medium text-[var(--color-muted)] mb-1">
                    Q{idx + 1}. {q.isCorrect ? "✓" : "✕"}
                  </p>
                  <p className="text-xs text-[var(--color-text)]">{q.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      q.isCorrect
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {q.userAnswer}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-[var(--color-muted)]">
                StudyMate - {new Date().toLocaleDateString()}
              </p>
            </div>
          </motion.div>

          {/* Review Your Answers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Review Your Answers
              </h2>
              <a href="#" className="text-xs text-[var(--color-primary)] hover:underline">
                Export Results
              </a>
            </div>

            <div className="space-y-3">
              {MOCK_RESULT.questions.map((question, idx) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  className={`bg-[var(--color-bg-light)] border-l-4 rounded-lg p-4 ${
                    question.isCorrect
                      ? "border-l-emerald-500"
                      : "border-l-red-500"
                  }`}
                >
                  {/* Question Number and Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full ${
                          question.isCorrect
                            ? "bg-emerald-500/20"
                            : "bg-red-500/20"
                        }`}
                      >
                        {question.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <span className="font-medium text-[var(--color-text)]">
                        Question {idx + 1}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        question.isCorrect
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {question.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  {/* Question Text */}
                  <p className="text-sm text-[var(--color-text)] mb-3">
                    {question.text}
                  </p>

                  {/* Answers */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-start bg-[var(--color-bg)] p-3 rounded border border-[var(--color-border)]">
                      <div>
                        <p className="text-[var(--color-muted)] mb-1">Your answer:</p>
                        <p
                          className={
                            question.isCorrect
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                        >
                          {question.userAnswer}
                        </p>
                      </div>
                    </div>

                    {!question.isCorrect && (
                      <div className="flex justify-between items-start bg-[var(--color-bg)] p-3 rounded border border-[var(--color-border)]">
                        <div>
                          <p className="text-[var(--color-muted)] mb-1">Correct answer:</p>
                          <p className="text-emerald-400">
                            {question.correctAnswer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-3 justify-center sm:justify-end"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
            <button
              onClick={() => router.push("/quizzes")}
              className="px-6 py-2 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Try Another Quiz
            </button>
          </motion.div>
        </div>
      </main>
    </>
  );
}
