"use client";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      title: "Create Your Notes",
      desc: "Write or paste your study material into our intuitive note editor.",
      color: "var(--color-primary)",
    },
    {
      title: "AI Does the Work",
      desc: "Our AI automatically generates quizzes, flashcards, and summaries.",
      color: "var(--color-accent)",
    },
    {
      title: "Study & Excel",
      desc: "Practice with interactive quizzes and track your progress over time.",
      color: "var(--color-primary)",
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-[var(--color-bg)] text-center text-[var(--color-white)] overflow-hidden">
      {/* subtle gradient separator */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0D] to-transparent opacity-60 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold mb-3"
        >
          How <span className="text-[var(--color-accent)]">StudyMate</span> Works
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[var(--color-muted)] mb-16 text-lg"
        >
          Three simple steps to supercharge your learning
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-14 h-14 flex items-center justify-center rounded-full font-bold text-lg mb-6 transition-all duration-300"
                style={{
                  backgroundColor: step.color,
                  color: "var(--color-bg)",
                  boxShadow: `0 0 20px ${step.color}60`,
                }}
              >
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-[var(--color-muted)] max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
