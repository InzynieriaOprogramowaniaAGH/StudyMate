"use client";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    { title: "AI Flashcards", desc: "Turn your notes into smart flashcards." },
    { title: "Quiz Generator", desc: "Create quizzes to test your knowledge." },
    { title: "AI Summaries", desc: "Summarize topics into key learning points." },
  ];

  return (
    <section className="py-24 px-6 bg-bg-light text-center">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl font-bold mb-12 text-white"
      >
        Powerful <span className="text-accent">AI Features</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-8 bg-bg rounded-2xl border border-border hover:border-primary transition"
          >
            <h3 className="text-xl font-semibold mb-3 text-primary">{f.title}</h3>
            <p className="text-muted">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
