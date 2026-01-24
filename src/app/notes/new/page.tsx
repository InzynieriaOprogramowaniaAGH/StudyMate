"use client";

import Header from "@/components/layout/Header";
import { ArrowLeft, Sparkles, Save, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NewNotePage() {
  const router = useRouter();
  const t = useTranslations("notes");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    content: "",
    isPrivate: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subjects = [
    { key: "computerScience", label: t("subjects.computerScience") },
    { key: "mathematics", label: t("subjects.mathematics") },
    { key: "physics", label: t("subjects.physics") },
    { key: "chemistry", label: t("subjects.chemistry") },
    { key: "biology", label: t("subjects.biology") },
    { key: "history", label: t("subjects.history") },
    { key: "literature", label: t("subjects.literature") },
    { key: "economics", label: t("subjects.economics") },
    { key: "psychology", label: t("subjects.psychology") },
    { key: "art", label: t("subjects.art") },
    { key: "music", label: t("subjects.music") },
    { key: "languages", label: t("subjects.languages") },
    { key: "other", label: t("subjects.other") },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t("new.validation.titleRequired");
    } else if (formData.title.length < 3) {
      newErrors.title = t("new.validation.titleMinLength");
    }

    if (!formData.subject) {
      newErrors.subject = t("new.validation.subjectRequired");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("new.validation.descriptionRequired");
    } else if (formData.description.length < 10) {
      newErrors.description = t("new.validation.descriptionMinLength");
    }

    if (!formData.content.trim()) {
      newErrors.content = t("new.validation.contentRequired");
    } else if (formData.content.length < 20) {
      newErrors.content = t("new.validation.contentMinLength");
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      // Success - redirect to notes page
      router.push("/notes");
    } catch (error) {
      console.error("Error creating note:", error);
      setErrors({ submit: t("new.failedCreate") });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          {/* Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4 mb-8"
          >
            <Link
              href="/notes"
              className="flex items-center gap-2 text-[var(--color-text)] opacity-70 hover:opacity-100 transition p-2 rounded-lg hover:bg-[var(--color-bg-light)]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{t("new.backToNotes")}</span>
            </Link>
          </motion.div>

          {/* Main Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 md:p-10"
          >
            {/* Title Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
                  {t("new.title")}
                </h1>
                <Sparkles className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <p className="text-sm text-[var(--color-muted)]">
                {t("new.subtitle")}
              </p>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                {errors.submit}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text)]">
                  {t("new.noteTitle")} *
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t("new.noteTitlePlaceholder")}
                  className={`w-full px-4 py-3 bg-[var(--color-bg)] border rounded-lg text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition ${
                    errors.title ? "border-red-500" : "border-[var(--color-border)]"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-400">{errors.title}</p>
                )}
              </div>

              {/* Subject Field */}
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-[var(--color-text)]">
                  {t("new.subject")} *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[var(--color-bg)] border rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition ${
                    errors.subject ? "border-red-500" : "border-[var(--color-border)]"
                  }`}
                >
                  <option value="">{t("new.selectSubject")}</option>
                  {subjects.map((subject) => (
                    <option key={subject.key} value={subject.label}>
                      {subject.label}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="text-xs text-red-400">{errors.subject}</p>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-[var(--color-text)]">
                  {t("new.description")} *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t("new.descriptionPlaceholder")}
                  rows={3}
                  className={`w-full px-4 py-3 bg-[var(--color-bg)] border rounded-lg text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition resize-none ${
                    errors.description ? "border-red-500" : "border-[var(--color-border)]"
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-400">{errors.description}</p>
                )}
              </div>

              {/* Content Field */}
              <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium text-[var(--color-text)]">
                  {t("new.noteContent")} *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder={t("new.contentPlaceholder")}
                  rows={10}
                  className={`w-full px-4 py-3 bg-[var(--color-bg)] border rounded-lg text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition resize-none ${
                    errors.content ? "border-red-500" : "border-[var(--color-border)]"
                  }`}
                />
                {errors.content && (
                  <p className="text-xs text-red-400">{errors.content}</p>
                )}
                <p className="text-xs text-[var(--color-muted)]">
                  {formData.content.length} / 10000 {t("new.characters")}
                </p>
              </div>

              {/* Privacy Toggle */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[var(--color-text)]">
                  {t("new.visibility")}
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPrivate: true }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                      formData.isPrivate
                        ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">{t("new.private")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPrivate: false }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                      !formData.isPrivate
                        ? "bg-[var(--color-success)]/20 border-[var(--color-success)] text-[var(--color-success)]"
                        : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-success)]"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="font-medium">{t("new.public")}</span>
                  </button>
                </div>
                <p className="text-xs text-[var(--color-muted)]">
                  {formData.isPrivate ? t("new.privateDescription") : t("new.publicDescription")}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-[var(--color-border)]">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-primary)] text-black px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? t("new.saving") : t("new.saveNote")}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/notes")}
                  className="flex-1 px-6 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] transition"
                >
                  {t("new.cancel")}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-8 p-4 bg-[var(--color-bg-light)]/50 border border-[var(--color-border)] rounded-lg"
          >
            <h3 className="text-sm font-medium text-[var(--color-text)] mb-2">
              {t("new.tips.title")}
            </h3>
            <ul className="text-xs text-[var(--color-muted)] space-y-1">
              <li>• {t("new.tips.tip1")}</li>
              <li>• {t("new.tips.tip2")}</li>
              <li>• {t("new.tips.tip3")}</li>
              <li>• {t("new.tips.tip4")}</li>
              <li>• {t("new.tips.tip5")}</li>
            </ul>
          </motion.div>
        </div>
      </main>
    </>
  );
}
