"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center py-24 px-6 bg-bg">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-primary-10 text-primary text-sm px-3 py-1 rounded-full mb-4"
      >
        🤖 AI-Powered Learning
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-5xl md:text-6xl font-bold mb-4 text-white"
      >
        Study Smarter with Your <span className="text-primary">AI Assistant</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-muted max-w-xl mb-8"
      >
        Transform your notes into interactive quizzes and flashcards automatically.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Link
          href="/signup"
          className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-xl font-medium transition"
        >
          Start Learning Free
        </Link>
        <Link
          href="#how"
          className="border border-border hover:border-primary px-6 py-3 rounded-xl font-medium text-white transition"
        >
          See How It Works
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-16"
      >
        <Image
          src="/images/hero-dashboard.jpg"
          alt="StudyMate Dashboard"
          width={300}
          height={175}
          className="rounded-2xl shadow-xl border border-border"
        />
      </motion.div>
    </section>
  );
}
