"use client";

import Header from "@/components/layout/Header";
import { ArrowLeft, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Note {
  id: string;
  title: string;
  subject?: string;
  description?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;
  const t = useTranslations("notes");

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

  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    content: "",
  });

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/notes/${noteId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch note");
        }

        const data = await response.json();
        setNote(data);
        setFormData({
          title: data.title,
          subject: data.subject || "",
          description: data.description || "",
          content: data.content,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching note:", err);
        setError("Failed to load note");
      } finally {
        setIsLoading(false);
      }
    };

    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError(t("new.validation.titleRequired"));
      return;
    }

    if (!formData.content.trim()) {
      setError(t("new.validation.contentRequired"));
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const updatedNote = await response.json();
      router.push(`/notes/${noteId}`);
    } catch (err) {
      console.error("Error updating note:", err);
      setError("Failed to update note");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
          <Loader className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        </main>
      </>
    );
  }

  if (error && !note) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href="/notes"
              className="flex items-center gap-2 text-[var(--color-primary)] hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("detail.backToNotes")}
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center"
            >
              <p className="font-medium">{error}</p>
            </motion.div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          <Link
            href={`/notes/${noteId}`}
            className="flex items-center gap-2 text-[var(--color-primary)] hover:underline mb-6 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("detail.backToNotes")}
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">
              {t("edit.title")}
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              {t("edit.subtitle")}
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                {t("new.noteTitle")}
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
                placeholder={t("new.noteTitlePlaceholder")}
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                {t("new.subject")}
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition"
              >
                <option value="">{t("new.selectSubject")}</option>
                {subjects.map((subj) => (
                  <option key={subj.key} value={subj.label}>
                    {subj.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                {t("new.description")}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition resize-none"
                placeholder={t("new.descriptionPlaceholder")}
                rows={3}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                {t("new.noteContent")}
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition resize-vertical font-mono text-sm"
                placeholder={t("new.contentPlaceholder")}
                rows={12}
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-black rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    {t("new.saving")}
                  </>
                ) : (
                  t("edit.saveChanges")
                )}
              </button>
              <Link
                href={`/notes/${noteId}`}
                className="flex items-center justify-center px-6 py-3 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-darker)] transition"
              >
                {t("new.cancel")}
              </Link>
            </div>
          </motion.form>
        </div>
      </main>
    </>
  );
}
