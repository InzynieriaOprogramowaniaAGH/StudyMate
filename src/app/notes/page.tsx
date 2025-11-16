"use client";

import Header from "@/components/layout/Header";
import { Search, Filter, MoreVertical, Clipboard, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotesPage() {
  const [hoveredNoteId, setHoveredNoteId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const notes = [
    {
      id: 1,
      subject: "Computer Science",
      title: "Introduction to Machine Learning",
      description: "Machine learning is a subset of artificial intelligence that focuses on...",
      timestamp: "2 hours ago",
      quizzes: 3,
      cards: 24,
    },
    {
      id: 2,
      subject: "History",
      title: "World War II Timeline",
      description: "World War II was a global conflict that lasted from 1939 to 1945...",
      timestamp: "Yesterday",
      quizzes: 2,
      cards: 16,
    },
    {
      id: 3,
      subject: "Chemistry",
      title: "Organic Chemistry Basics",
      description: "Organic chemistry is the study of carbon-containing compounds...",
      timestamp: "2 days ago",
      quizzes: 4,
      cards: 32,
    },
    {
      id: 4,
      subject: "Mathematics",
      title: "Calculus Fundamentals",
      description: "Calculus is the mathematical study of continuous change...",
      timestamp: "3 days ago",
      quizzes: 5,
      cards: 28,
    },
    {
      id: 5,
      subject: "Biology",
      title: "Cell Biology Overview",
      description: "Cells are the basic structural and functional units of life...",
      timestamp: "4 days ago",
      quizzes: 2,
      cards: 20,
    },
    {
      id: 6,
      subject: "Literature",
      title: "Shakespeare's Tragedies",
      description: "Shakespeare wrote several famous tragedies including Hamlet, Macbeth...",
      timestamp: "5 days ago",
      quizzes: 1,
      cards: 15,
    },
  ];

  const menuOptions = [
    { label: "Edit", color: "text-[var(--color-text)]" },
    { label: "Generate Quiz", color: "text-[var(--color-text)]" },
    { label: "Create Flashcards", color: "text-[var(--color-text)]" },
    { label: "Delete", color: "text-red-500" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">My Notes</h1>
              <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">Manage and organize your study materials</p>
            </div>
            <button className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition flex items-center gap-2 w-fit">
              <span>+</span> Create Note
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:border-[var(--color-primary)] transition whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                onMouseEnter={() => setHoveredNoteId(note.id)}
                onMouseLeave={() => {
                  setHoveredNoteId(null);
                  setOpenMenuId(null);
                }}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4 }}
              >
                <Card className="bg-[var(--color-bg-light)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition h-60 sm:h-64">
                  <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                    {/* Header with subject and menu */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-medium text-[var(--color-primary)]">
                        {note.subject}
                      </span>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === note.id ? null : note.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                            openMenuId === note.id
                              ? "bg-[var(--color-accent)]/30 text-[var(--color-accent)]"
                              : "text-[var(--color-muted)] hover:bg-[var(--color-accent)]/30 hover:text-[var(--color-accent)]"
                          }`}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {openMenuId === note.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -8 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -8 }}
                              className="absolute right-0 top-full mt-2 w-40 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg overflow-hidden shadow-lg z-10"
                            >
                              {menuOptions.map((option, idx) => (
                                <motion.button
                                  key={idx}
                                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                                  className={`w-full text-left px-4 py-2 text-sm ${option.color}`}
                                >
                                  {option.label}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-[var(--color-text)] mb-2 line-clamp-2">
                      {note.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[var(--color-muted)] mb-4 line-clamp-2 flex-1">
                      {note.description}
                    </p>

                    {/* Timestamp */}
                    <div className="text-xs text-[var(--color-muted)] mb-4 flex items-center gap-2">
                      <span className="w-1 h-1 bg-[var(--color-muted)] rounded-full"></span>
                      {note.timestamp}
                    </div>

                    {/* Footer with quizzes and cards */}
                    <div className="flex gap-4 text-xs text-[var(--color-text)]">
                      <div className="flex items-center gap-1">
                        <Clipboard className="w-4 h-4" />
                        <span>{note.quizzes} quizzes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{note.cards} cards</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}