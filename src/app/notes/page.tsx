"use client";

import Header from "@/components/layout/Header";
import { Search, Filter, MoreVertical, Clipboard, BookOpen, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function NotesPage() {
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/notes");
        
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        
        const data = await response.json();
        setNotes(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes");
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === "" || note.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  // Get unique subjects
  const subjects = Array.from(new Set(notes.map((note) => note.subject).filter(Boolean)));

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
            <Link href="/notes/new" className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition flex items-center gap-2 w-fit">
              <span>+</span> Create Note
            </Link>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] transition"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:border-[var(--color-primary)] transition whitespace-nowrap"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>

              {/* Filter Dropdown */}
              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg overflow-hidden shadow-lg z-10"
                  >
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                      onClick={() => {
                        setSelectedSubject("");
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition ${
                        selectedSubject === ""
                          ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                          : "text-[var(--color-text)]"
                      }`}
                    >
                      All Subjects
                    </motion.button>
                    {subjects.map((subject) => (
                      <motion.button
                        key={subject}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                        onClick={() => {
                          setSelectedSubject(subject);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition border-t border-[var(--color-border)] ${
                          selectedSubject === subject
                            ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                            : "text-[var(--color-text)]"
                        }`}
                      >
                        {subject}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Notes Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center"
            >
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-2">Please try refreshing the page</p>
            </motion.div>
          ) : filteredNotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <BookOpen className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                {searchQuery ? "No notes found" : "No notes yet"}
              </h3>
              <p className="text-sm text-[var(--color-muted)] mb-4">
                {searchQuery
                  ? "Try a different search query"
                  : "Create your first note to get started"}
              </p>
              {!searchQuery && (
                <Link
                  href="/notes/new"
                  className="inline-block bg-[var(--color-primary)] text-black px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition"
                >
                  + Create Note
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {filteredNotes.map((note) => (
                <Link key={note.id} href={`/notes/${note.id}`}>
                  <motion.div
                    onMouseEnter={() => setHoveredNoteId(note.id)}
                    onMouseLeave={() => {
                      setHoveredNoteId(null);
                      setOpenMenuId(null);
                    }}
                    className="relative cursor-pointer"
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
                          {note.subject || "General"}
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
                        {note.description || note.content?.substring(0, 100) || "No description"}
                      </p>

                      {/* Timestamp */}
                      <div className="text-xs text-[var(--color-muted)] mb-4 flex items-center gap-2">
                        <span className="w-1 h-1 bg-[var(--color-muted)] rounded-full"></span>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>

                      {/* Footer with content length info */}
                      <div className="flex gap-4 text-xs text-[var(--color-text)]">
                        <div className="flex items-center gap-1">
                          <Clipboard className="w-4 h-4" />
                          <span>{note.content?.length || 0} chars</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                    </motion.div>
                  </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}