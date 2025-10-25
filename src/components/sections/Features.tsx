"use client";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    { title: "AI Flashcards", desc: "Turn your notes into smart flashcards." },
    { title: "Quiz Generator", desc: "Create quizzes to test your knowledge." },
    { title: "AI Summaries", desc: "Summarize topics into key learning points." },
  ];

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 bg-bg-light text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-12 text-white">
        Powerful <span className="text-accent">AI Features</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{
              y: -5,
              boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
              scale: 1.02,
              transition: { type: "spring", stiffness: 150, damping: 12 },
            }}
            className="p-8 bg-bg rounded-2xl border border-border "
          >
            <h3 className="text-xl font-semibold mb-3 text-primary">{f.title}</h3>
            <p className="text-muted">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
