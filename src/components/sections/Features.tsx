"use client";
import { motion } from "framer-motion";
import {
  Sparkles,
  Layers,
  BookOpen,
  LineChart,
  Edit3,
  Target,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Features() {
  const t = useTranslations("features");

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t("aiQuizzes.title"),
      desc: t("aiQuizzes.desc"),
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: t("flashcards.title"),
      desc: t("flashcards.desc"),
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: t("summaries.title"),
      desc: t("summaries.desc"),
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: t("progress.title"),
      desc: t("progress.desc"),
    },
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: t("notes.title"),
      desc: t("notes.desc"),
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: t("personalized.title"),
      desc: t("personalized.desc"),
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-[var(--color-bg-darker)] text-center text-[var(--color-white)] overflow-hidden">
      {/* subtle background glow layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0E0E13] to-transparent opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold mb-4"
        >
          {t("title")}{" "}
          <span className="text-[var(--color-accent)]">{t("titleHighlight")}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
         
          className="text-[var(--color-muted)] mb-16 text-lg max-w-2xl mx-auto"
        >
          {t("subtitle")}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const isBlue = i % 2 === 0;
            const tint = isBlue ? "var(--color-primary)" : "var(--color-accent)";
            const tint10 = isBlue ? "var(--color-primary-10)" : "var(--color-accent-10)";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                
                whileHover={{
                  y: -6,
                  scale: 1.03,
                  boxShadow: `0 0 30px ${tint}40`,
                }}
                className="p-8 bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] text-left "
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl mb-6 "
                  style={{
                    backgroundColor: tint10,
                    color: tint,
                    boxShadow: `0 0 12px ${tint}20`,
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--color-muted)]">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
