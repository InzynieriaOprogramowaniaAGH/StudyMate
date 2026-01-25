"use client";

import Header from "@/components/layout/Header";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Plus, Trash2, ArrowLeft, Lock, Globe, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface FlashcardItem {
  id?: string;
  front: string;
  back: string;
  frontImage?: string | null;
  backImage?: string | null;
  useFrontImage?: boolean;
  useBackImage?: boolean;
}

export default function EditFlashcardsPage() {
  const t = useTranslations("flashcards");
  const params = useParams();
  const setId = params.id as string;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(true);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [deletedCardIds, setDeletedCardIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/flashcards/${setId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch flashcard set");
        }
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.noteTitle || "");
        setFlashcards(
          data.cards.map((card: any) => ({
            id: card.id,
            front: card.front || "",
            back: card.back || "",
            frontImage: card.frontImage,
            backImage: card.backImage,
            useFrontImage: !!card.frontImage && !card.front,
            useBackImage: !!card.backImage && !card.back,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (setId) {
      fetchFlashcardSet();
    }
  }, [setId]);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Upload failed");
    }

    const data = await response.json();
    return data.url;
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    cardIndex: number,
    side: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(`${cardIndex}-${side}`);
      const imageUrl = await uploadImage(file);
      const newFlashcards = [...flashcards];
      if (side === "front") {
        newFlashcards[cardIndex].frontImage = imageUrl;
      } else {
        newFlashcards[cardIndex].backImage = imageUrl;
      }
      setFlashcards(newFlashcards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(null);
    }
  };

  const addFlashcard = () => {
    setFlashcards([...flashcards, { front: "", back: "", useFrontImage: false, useBackImage: false }]);
  };

  const removeFlashcard = (index: number) => {
    const card = flashcards[index];
    if (card.id) {
      setDeletedCardIds([...deletedCardIds, card.id]);
    }
    setFlashcards(flashcards.filter((_, i) => i !== index));
  };

  const updateFlashcard = (index: number, field: keyof FlashcardItem, value: string | boolean | undefined) => {
    const newFlashcards = [...flashcards];
    (newFlashcards[index] as any)[field] = value;
    setFlashcards(newFlashcards);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError(t("validation.titleRequired") || "Title is required");
      return;
    }

    if (flashcards.length === 0) {
      setError(t("validation.minCards") || "At least one flashcard is required");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(`/api/flashcards/${setId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          isPrivate,
          cards: flashcards.map((card) => ({
            id: card.id,
            front: card.useFrontImage ? "" : card.front,
            back: card.useBackImage ? "" : card.back,
            frontImage: card.frontImage || null,
            backImage: card.backImage || null,
          })),
          deletedCardIds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update flashcards");
      }

      router.refresh();
      router.push("/flashcards");
    } catch (err) {
      console.error("Error updating flashcards:", err);
      setError(err instanceof Error ? err.message : "Failed to update flashcards");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            <p className="text-[var(--color-muted)]">{t("loading") || "Loading..."}</p>
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
            href="/flashcards"
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
              {t("edit.title") || "Edit Flashcards"}
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              {t("edit.subtitle") || "Update your flashcard set"}
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Set Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6"
            >
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                {t("creation.setInfo")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    {t("creation.setTitle")} *
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
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    {t("creation.privacy")}
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPrivate(true)}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border transition font-medium ${
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
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border transition font-medium ${
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

            {/* Flashcards */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                  {t("creation.cardsHeading")}
                </h2>
              </div>

              {flashcards.map((card, cardIndex) => (
                <motion.div
                  key={cardIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + cardIndex * 0.05 }}
                  className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text)]">
                      {t("creation.cardLabel")} {cardIndex + 1}
                    </h3>
                    {flashcards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFlashcard(cardIndex)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Front Side */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-[var(--color-text)]">
                        {t("creation.front")} *
                      </label>
                      
                      {/* Text/Image Toggle */}
                      <div>
                        <div className="relative inline-flex gap-0 border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg)]">
                          <div
                            className="absolute top-0 bottom-0 w-1/2 bg-[var(--color-primary)] pointer-events-none"
                            style={{
                              transform: card.useFrontImage ? "translateX(100%)" : "translateX(0)",
                              transition: "transform 0.3s ease",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => updateFlashcard(cardIndex, "useFrontImage", false)}
                            className="relative p-2 text-sm font-medium z-10 transition-colors w-24 text-center"
                            style={{ color: !card.useFrontImage ? "white" : "var(--color-text)" }}
                          >
                            {t("creation.textMode")}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateFlashcard(cardIndex, "useFrontImage", true)}
                            className="relative p-2 text-sm font-medium z-10 transition-colors flex items-center justify-center gap-1 w-24"
                            style={{ color: card.useFrontImage ? "white" : "var(--color-text)" }}
                          >
                            <ImageIcon className="w-4 h-4" />
                            {t("creation.imageMode")}
                          </button>
                        </div>
                      </div>

                      {!card.useFrontImage ? (
                        <textarea
                          value={card.front}
                          onChange={(e) => updateFlashcard(cardIndex, "front", e.target.value)}
                          placeholder={t("creation.frontPlaceholder")}
                          rows={3}
                          className="w-full px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                        />
                      ) : (
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] cursor-pointer transition">
                            <ImageIcon className="w-4 h-4" />
                            {card.frontImage ? t("creation.changeImage") : t("creation.uploadImage")}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, cardIndex, "front")}
                              disabled={uploadingImage === `${cardIndex}-front`}
                              className="hidden"
                            />
                          </label>
                          {card.frontImage && (
                            <div className="relative">
                              <img
                                src={card.frontImage}
                                alt="Front"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => updateFlashcard(cardIndex, "frontImage", undefined)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Back Side */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-[var(--color-text)]">
                        {t("creation.backLabel")} *
                      </label>
                      
                      {/* Text/Image Toggle */}
                      <div>
                        <div className="relative inline-flex gap-0 border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg)]">
                          <div
                            className="absolute top-0 bottom-0 w-1/2 bg-[var(--color-primary)] pointer-events-none"
                            style={{
                              transform: card.useBackImage ? "translateX(100%)" : "translateX(0)",
                              transition: "transform 0.3s ease",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => updateFlashcard(cardIndex, "useBackImage", false)}
                            className="relative p-2 text-sm font-medium z-10 transition-colors w-24 text-center"
                            style={{ color: !card.useBackImage ? "white" : "var(--color-text)" }}
                          >
                            {t("creation.textMode")}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateFlashcard(cardIndex, "useBackImage", true)}
                            className="relative p-2 text-sm font-medium z-10 transition-colors flex items-center justify-center gap-1 w-24"
                            style={{ color: card.useBackImage ? "white" : "var(--color-text)" }}
                          >
                            <ImageIcon className="w-4 h-4" />
                            {t("creation.imageMode")}
                          </button>
                        </div>
                      </div>

                      {!card.useBackImage ? (
                        <textarea
                          value={card.back}
                          onChange={(e) => updateFlashcard(cardIndex, "back", e.target.value)}
                          placeholder={t("creation.backPlaceholder")}
                          rows={3}
                          className="w-full px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
                        />
                      ) : (
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] cursor-pointer transition">
                            <ImageIcon className="w-4 h-4" />
                            {card.backImage ? t("creation.changeImage") : t("creation.uploadImage")}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, cardIndex, "back")}
                              disabled={uploadingImage === `${cardIndex}-back`}
                              className="hidden"
                            />
                          </label>
                          {card.backImage && (
                            <div className="relative">
                              <img
                                src={card.backImage}
                                alt="Back"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => updateFlashcard(cardIndex, "backImage", undefined)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add Card Button */}
              <motion.button
                type="button"
                onClick={addFlashcard}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-4 border-2 border-dashed border-[var(--color-border)] rounded-lg text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t("creation.addCard")}
              </motion.button>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end gap-4"
            >
              <Link
                href="/flashcards"
                className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-lg hover:border-[var(--color-primary)] transition"
              >
                {t("cancel") || "Cancel"}
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("saving") || "Saving..."}
                  </>
                ) : (
                  t("save") || "Save Changes"
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </main>
    </>
  );
}
