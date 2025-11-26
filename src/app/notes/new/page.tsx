"use client";

import Header from "@/components/layout/Header";
import { ArrowLeft, Sparkles, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NewNotePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    content: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    "Other",
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
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.subject) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Note content is required";
    } else if (formData.content.length < 20) {
      newErrors.content = "Content must be at least 20 characters";
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
      setErrors({ submit: "Failed to create note. Please try again." });
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
              <span className="text-sm font-medium">Back to Notes</span>
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
                  Create a New Note
                </h1>
                <Sparkles className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <p className="text-sm text-[var(--color-muted)]">
                Create and organize your study materials with AI assistance
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
                  Note Title *
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Introduction to Machine Learning"
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
                  Subject *
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
                  <option value="">Select a subject...</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
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
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of what this note is about..."
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
                  Note Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your note content here. Include key points, definitions, examples, and any important information you want to remember..."
                  rows={10}
                  className={`w-full px-4 py-3 bg-[var(--color-bg)] border rounded-lg text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition resize-none ${
                    errors.content ? "border-red-500" : "border-[var(--color-border)]"
                  }`}
                />
                {errors.content && (
                  <p className="text-xs text-red-400">{errors.content}</p>
                )}
                <p className="text-xs text-[var(--color-muted)]">
                  {formData.content.length} / 10000 characters
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
                  {isLoading ? "Saving..." : "Save Note"}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/notes")}
                  className="flex-1 px-6 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] transition"
                >
                  Cancel
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
              💡 Tips for creating effective notes:
            </h3>
            <ul className="text-xs text-[var(--color-muted)] space-y-1">
              <li>• Use clear and descriptive titles for easy searching</li>
              <li>• Organize content with bullet points or numbered lists</li>
              <li>• Include key terms and definitions</li>
              <li>• Add examples and use cases for better understanding</li>
              <li>• Review and update your notes regularly</li>
            </ul>
          </motion.div>
        </div>
      </main>
    </>
  );
}
