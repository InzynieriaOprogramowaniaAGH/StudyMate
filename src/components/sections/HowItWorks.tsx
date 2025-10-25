"use client";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    ["Create Your Notes", "Write or paste your study material."],
    ["AI Does the Work", "AI generates quizzes, flashcards, and summaries."],
    ["Study & Excel", "Practice with interactive quizzes and track progress."],
  ];

  return (
    <section id="how" className="py-24 text-center px-8 bg-bg">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-12 text-white"
      >
        How It <span className="text-accent">Works</span>
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map(([title, desc], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary text-white font-bold">
              {i + 1}
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">{title}</h3>
            <p className="text-muted">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
