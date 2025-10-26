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

export default function Features() {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Generated Quizzes",
      desc: "Automatically create practice questions from your notes using advanced AI.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Smart Flashcards",
      desc: "Generate flashcards instantly and study with spaced repetition algorithms.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "AI Summaries",
      desc: "Get concise summaries of your notes to quickly review key concepts.",
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Progress Tracking",
      desc: "Monitor your learning journey with detailed analytics and insights.",
    },
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: "Quick Note Taking",
      desc: "Capture ideas fast with our intuitive note editor and organization system.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Learning",
      desc: "AI adapts to your learning style and focuses on areas that need improvement.",
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
          Everything You Need to{" "}
          <span className="text-[var(--color-accent)]">Excel</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
         
          className="text-[var(--color-muted)] mb-16 text-lg max-w-2xl mx-auto"
        >
          Powerful features designed to make studying more effective and engaging
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
