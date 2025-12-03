"use client";

import Header from "@/components/layout/Header";
import { ArrowLeft, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Note {
  id: string;
  title: string;
  subject?: string;
  description?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const subjects = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Literature",
  "Economics",
  "Psychology",
  "Art",
  "Music",
  "Languages",
  "Science",
];

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

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
      setError("Title is required");
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
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
              Back to Notes
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
            Back to Note
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">
              Edit Note
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              Update your note content and settings
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
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
                placeholder="Enter note title..."
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition"
              >
                <option value="">Select a subject</option>
                {subjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition resize-none"
                placeholder="Brief description of your note..."
                rows={3}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition resize-vertical font-mono text-sm"
                placeholder="Enter your note content here..."
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
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <Link
                href={`/notes/${noteId}`}
                className="flex items-center justify-center px-6 py-3 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] transition"
              >
                Cancel
              </Link>
            </div>
          </motion.form>
        </div>
      </main>
    </>
  );
}
