"use client";

import Header from "@/components/layout/Header";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowLeft, Lock, Globe, Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface QuestionOption {
  text: string;
  image?: string;
  useImage?: boolean;
}

interface Question {
  question: string;
  questionImage?: string;
  useQuestionImage?: boolean;
  options: (string | QuestionOption)[];
  correctAnswer: number;
}

export default function CreateQuizPage() {
  const t = useTranslations("quizzes");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: -1, useQuestionImage: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(true);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const router = useRouter();

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP ${response.status}: ${t("questionPage.uploadFailed")}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.url;
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
    optionIndex?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(`${questionIndex}-${optionIndex ?? "q"}`);
      const imageUrl = await uploadImage(file);

      const newQuestions = [...questions];
      if (optionIndex !== undefined) {
        // Option image
        const option = newQuestions[questionIndex].options[optionIndex];
        if (typeof option === "string") {
          newQuestions[questionIndex].options[optionIndex] = {
            text: option,
            image: imageUrl,
            useImage: false,
          };
        } else {
          option.image = imageUrl;
        }
      } else {
        // Question image
        newQuestions[questionIndex].questionImage = imageUrl;
      }
      setQuestions(newQuestions);
    } catch (err) {
      setError(t("questionPage.uploadFailed"));
      console.error(err);
    } finally {
      setUploadingImage(null);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: -1, useQuestionImage: false }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    const option = newQuestions[questionIndex].options[optionIndex];
    if (typeof option === "string") {
      newQuestions[questionIndex].options[optionIndex] = value;
    } else {
      option.text = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError(t("validation.titleRequired") || "Title is required");
      return;
    }

    if (questions.some((q) => {
      if (q.useQuestionImage) {
        return !q.questionImage;
      }
      return !q.question.trim();
    })) {
      setError(t("validation.allQuestionsRequired") || "All questions must have text or image");
      return;
    }

    if (questions.some((q) => 
      q.options.some((o) => {
        const useImage = typeof o === 'string' ? false : (o.useImage ?? false);
        const text = typeof o === 'string' ? o : o.text;
        const image = typeof o === 'string' ? undefined : o.image;
        
        if (useImage) {
          return !image;
        }
        return !text.trim();
      })
    )) {
      setError(t("validation.allOptionsRequired") || "All options must have text or image");
      return;
    }

    if (questions.some((q) => q.correctAnswer === -1)) {
      setError(t("validation.correctAnswerRequired") || "Select correct answer for all questions");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          isPrivate,
          totalQuestions: questions.length,
          questions: questions.map((q) => {
            return {
              question: q.useQuestionImage ? "" : q.question,
              questionImage: q.questionImage,
              options: q.options,
              correctAnswer: q.correctAnswer.toString(),
            };
          }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create quiz`);
      }

      router.push("/quizzes");
    } catch (err) {
      console.error("Error creating quiz:", err);
      setError(err instanceof Error ? err.message : "Failed to create quiz");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("creation.back")}
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">
              {t("creation.title")}
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              {t("creation.subtitle")}
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Quiz Title and Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6"
            >
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                {t("creation.quizInfo")}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    {t("creation.quizTitle")} *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("creation.titlePlaceholder")}
                    className="w-full px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    {t("creation.description")}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("creation.descriptionPlaceholder")}
                    rows={3}
                    className="w-full px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                    {t("creation.privacy")}
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsPrivate(true)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition font-medium ${
                        isPrivate
                          ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)]"
                          : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      {t("privacy.private")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPrivate(false)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition font-medium ${
                        !isPrivate
                          ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)]"
                          : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      {t("privacy.public")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Questions */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                  {t("creation.questionsHeading")}
                </h2>
              </div>

              {questions.map((question, qIndex) => (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + qIndex * 0.05 }}
                  className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text)]">
                      {t("creation.questionLabel")} {qIndex + 1}
                    </h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Question Input Toggle */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                        {t("creation.questionPlaceholder")} *
                      </label>
                      <div className="relative inline-flex gap-0 mb-3 border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg)]">
                        <div
                          className="absolute top-0 bottom-0 w-1/2 bg-[var(--color-primary)] pointer-events-none rounded-l-md"
                          style={{
                            transform: question.useQuestionImage ? "translateX(100%)" : "translateX(0)",
                            transition: "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => updateQuestion(qIndex, "useQuestionImage", false)}
                          className="relative flex-1 px-8 py-2 text-sm font-medium z-10 transition-colors duration-500 text-center"
                          style={{
                            color: !question.useQuestionImage ? "white" : "var(--color-text)",
                          }}
                        >
                          {t("creation.textMode")}
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQuestion(qIndex, "useQuestionImage", true)}
                          className="relative flex-1 px-8 py-2 text-sm font-medium z-10 transition-colors duration-500 text-center flex items-center justify-center gap-2"
                          style={{
                            color: question.useQuestionImage ? "white" : "var(--color-text)",
                          }}
                        >
                          <span>{t("creation.imageMode")}</span>
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {!question.useQuestionImage ? (
                        <textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                          placeholder={t("creation.questionPlaceholder")}
                          rows={2}
                          className="w-full px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                        />
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <label className="flex-1 flex items-center gap-2 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] cursor-pointer transition">
                              <ImageIcon className="w-4 h-4" />
                              {question.questionImage ? t("creation.changeImage") : t("creation.uploadImage")}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, qIndex)}
                                disabled={uploadingImage === `${qIndex}-q`}
                                className="hidden"
                              />
                            </label>
                          </div>
                          {question.questionImage && (
                            <div className="flex items-center gap-2">
                              <img
                                src={question.questionImage}
                                alt="Question Preview"
                                className="h-32 rounded border border-[var(--color-border)]"
                              />
                              <button
                                type="button"
                                onClick={() => updateQuestion(qIndex, "questionImage", undefined)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Options */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                        {t("creation.answerOptions")} *
                      </label>
                      <div className="space-y-4">
                        {question.options.map((option, oIndex) => {
                          const optionText = typeof option === "string" ? option : option.text;
                          const optionImage = typeof option === "string" ? undefined : option.image;
                          const useImage = typeof option === "string" ? false : (option.useImage ?? false);

                          return (
                            <div key={oIndex} className="space-y-2">
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  value={oIndex}
                                  checked={question.correctAnswer === oIndex}
                                  onChange={(e) =>
                                    updateQuestion(qIndex, "correctAnswer", parseInt(e.target.value))
                                  }
                                  className="w-4 h-4"
                                />
                                {!useImage ? (
                                  <input
                                    type="text"
                                    value={optionText}
                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                    placeholder={`${t("creation.option")} ${oIndex + 1}`}
                                    className="flex-1 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                                  />
                                ) : (
                                  <label className="flex-1 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] cursor-pointer transition text-sm text-[var(--color-muted)]">
                                    <ImageIcon className="w-4 h-4 inline mr-2" />
                                    {optionImage ? t("creation.changeImage") : t("creation.uploadImage")}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(e, qIndex, oIndex)}
                                      disabled={uploadingImage === `${qIndex}-${oIndex}`}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                                <div className="relative inline-flex gap-0 border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg)]">
                                  <div
                                    className="absolute top-0 bottom-0 w-1/2 bg-[var(--color-primary)] pointer-events-none rounded-l-md"
                                    style={{
                                      transform: useImage ? "translateX(100%)" : "translateX(0)",
                                      transition: "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newQuestions = [...questions];
                                      const opt = newQuestions[qIndex].options[oIndex];
                                      if (typeof opt === "string") {
                                        newQuestions[qIndex].options[oIndex] = { text: opt, image: undefined, useImage: false };
                                      } else {
                                        opt.useImage = false;
                                      }
                                      setQuestions(newQuestions);
                                    }}
                                    className="relative flex-1 px-5 py-2 text-xs font-medium z-10 transition-colors duration-500 text-center"
                                    style={{
                                      color: !useImage ? "white" : "var(--color-text)",
                                    }}
                                  >
                                    {t("creation.textMode")}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newQuestions = [...questions];
                                      const opt = newQuestions[qIndex].options[oIndex];
                                      if (typeof opt === "string") {
                                        newQuestions[qIndex].options[oIndex] = { text: opt, image: undefined, useImage: true };
                                      } else {
                                        opt.useImage = true;
                                      }
                                      setQuestions(newQuestions);
                                    }}
                                    className="relative flex-1 px-5 py-2 text-xs font-medium z-10 transition-colors duration-500 text-center flex items-center justify-center gap-1"
                                    style={{
                                      color: useImage ? "white" : "var(--color-text)",
                                    }}
                                  >
                                    <ImageIcon className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              {useImage && optionImage && (
                                <div className="flex items-center gap-2 ml-7">
                                  <img
                                    src={optionImage}
                                    alt="Preview"
                                    className="h-16 rounded border border-[var(--color-border)]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newQuestions = [...questions];
                                      const opt = newQuestions[qIndex].options[oIndex];
                                      if (typeof opt !== "string") {
                                        opt.image = undefined;
                                      }
                                      setQuestions(newQuestions);
                                    }}
                                    className="p-1 text-red-400 hover:bg-red-500/20 rounded transition"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add Question Button */}
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition font-medium"
            >
              <Plus className="w-4 h-4" />
              {t("creation.addQuestion")}
            </button>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-[var(--color-border)]">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition font-medium disabled:opacity-50"
              >
                {isLoading ? t("creation.creating") : t("creation.createButton")}
              </button>
              <Link
                href="/quizzes"
                className="flex-1 px-6 py-2 bg-[var(--color-bg-light)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-border)] transition font-medium text-center"
              >
                {t("creation.cancelButton")}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
