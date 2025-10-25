"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motionutils";

export default function Testimonials() {
  const testimonials = [
    ["Sarah K.", "Medical Student", "StudyMate helped me ace my exams! The AI quizzes are spot-on."],
    ["Michael T.", "Engineering Student", "Flashcards with spaced repetition changed my learning game."],
    ["Emma L.", "Law Student", "Automatic summaries save hours of work. Total lifesaver!"],
  ];

  return (
    <motion.section
      id="testimonials"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="py-24 bg-bg-light px-8 text-text"
    >
      <motion.h2
        variants={fadeInUp}
        className="text-center text-3xl font-bold mb-12 text-accent font-clarity"
      >
        Loved by Students Everywhere
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map(([name, role, quote], i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="bg-bg p-6 rounded-2xl border border-border hover:border-primary transition"
          >
            <p className="text-text italic mb-4">“{quote}”</p>
            <p className="text-sm text-muted">
              — <span className="text-white font-semibold">{name}</span>, {role}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
