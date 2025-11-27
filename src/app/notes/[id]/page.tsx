"use client";

import Header from "@/components/layout/Header";
import { ArrowLeft, Edit2, MoreVertical, Loader, HelpCircle, BookOpen, Sparkles, Copy, Download, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Note {
  id: string;
  title: string;
  subject?: string;
  description?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NoteDetailPage() {
  const params = useParams();
  const noteId = params.id as string;
  
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/notes/${noteId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch note");
        }
        
        const data = await response.json();
        setNote(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching note:", err);
        setError("Failed to load note");
      } finally {
        setIsLoading(false);
      }
    };

    if (noteId) {
      fetchNoteData();
    }
  }, [noteId]);

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

  if (error || !note) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
          <div className="max-w-7xl mx-auto px-4 py-8">
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
              <p className="font-medium">{error || "Note not found"}</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/notes"
              className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition mb-6 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Notes
            </Link>
          </motion.div>

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8"
          >
            <div className="flex-1">
              {note.subject && (
                <span className="inline-block text-xs font-medium text-[var(--color-primary)] mb-4">
                  {note.subject}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">
                {note.title}
              </h1>
              <p className="text-sm text-[var(--color-muted)]">
                Last edited {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2 flex-shrink-0 relative">
              <Link
                href={`/notes/${noteId}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-black rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition whitespace-nowrap"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Link>
              <button 
                onClick={() => setOpenMenu(!openMenu)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-bg-light)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {openMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg overflow-hidden shadow-lg z-10"
                  >
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover:text-[var(--color-primary)] transition"
                      onClick={() => {
                        navigator.clipboard.writeText(note?.title || "");
                        setOpenMenu(false);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover:text-[var(--color-primary)] transition border-t border-[var(--color-border)]"
                      onClick={() => setOpenMenu(false)}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 flex items-center gap-2 hover:text-red-400 transition border-t border-[var(--color-border)]"
                      onClick={() => setOpenMenu(false)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Note Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Note Content Card */}
              <div className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Note Content</h2>
                <div className="text-[var(--color-text)] whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {note.content}
                </div>
              </div>

              {/* AI-Generated Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--color-accent-dark)] border border-[var(--color-accent-border)] rounded-lg p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                  <h3 className="font-semibold text-[var(--color-text)]">AI-Generated Summary</h3>
                </div>
                <p className="text-[var(--color-text)] leading-relaxed text-sm sm:text-base">
                  {note.description || "A comprehensive summary of your note content would appear here once AI processing is complete."}
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column - Study Materials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-1"
            >
              {/* Study Materials Card */}
              <div className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Study Materials</h3>
                <p className="text-xs text-[var(--color-muted)] mb-6">
                  AI-generated from this note
                </p>

                {/* Study Items */}
                <div className="space-y-3 mb-6">
                  {/* Quiz */}
                  <div className="flex items-start gap-3 p-3 bg-[var(--color-bg)] rounded-lg hover:border-[var(--color-primary)] border border-[var(--color-border)] transition cursor-pointer group">
                    <div className="flex-shrink-0 mt-0.5">
                      <HelpCircle className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[var(--color-text)]">
                        Quiz
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">5 Questions</p>
                    </div>
                  </div>

                  {/* Flashcards */}
                  <div className="flex items-start gap-3 p-3 bg-[var(--color-bg)] rounded-lg hover:border-[var(--color-primary)] border border-[var(--color-border)] transition cursor-pointer group">
                    <div className="flex-shrink-0 mt-0.5">
                      <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[var(--color-text)]">
                        Flashcards
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">24 cards</p>
                    </div>
                  </div>
                </div>

                {/* Generate More Section */}
                <div className="border-t border-[var(--color-border)] pt-4 mb-6">
                  <h4 className="text-xs font-semibold text-[var(--color-text)] mb-3 uppercase tracking-wide">
                    Generate More
                  </h4>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--color-text)] bg-[var(--color-bg)] rounded-lg hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition border border-[var(--color-border)] hover:border-[var(--color-primary)]">
                      <span>➕</span> New Quiz
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--color-text)] bg-[var(--color-bg)] rounded-lg hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition border border-[var(--color-border)] hover:border-[var(--color-primary)]">
                      <span>📇</span> More Flashcards
                    </button>
                  </div>
                </div>

                {/* Statistics */}
                <div className="border-t border-[var(--color-border)] pt-4">
                  <h4 className="text-xs font-semibold text-[var(--color-text)] mb-4 uppercase tracking-wide">
                    Statistics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--color-muted)]">Words</span>
                      <span className="text-sm font-semibold text-[var(--color-text)]">
                        {note.content.split(/\s+/).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--color-muted)]">Reading time</span>
                      <span className="text-sm font-semibold text-[var(--color-text)]">
                        {Math.ceil(note.content.split(/\s+/).length / 200)} min
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--color-muted)]">Times reviewed</span>
                      <span className="text-sm font-semibold text-[var(--color-text)]">7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--color-muted)]">Quiz avg score</span>
                      <span className="text-sm font-semibold text-[var(--color-text)]">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
