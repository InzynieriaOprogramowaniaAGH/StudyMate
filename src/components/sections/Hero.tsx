"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";



export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center py-20 sm:py-24 px-4 sm:px-6 bg-bg">
    <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-4"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-accent) 15%, transparent)",
          color: "var(--color-accent)",
        }}
      >
        <Sparkles className="w-4 h-4" />         
        AI-Powered Learning
    </motion.span>



      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight"
      >
        <span className="bg-[radial-gradient(circle_at_center,var(--color-primary),var(--color-accent))] bg-clip-text text-transparent">
          Study Smarter with Your AI Assistant
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-muted max-w-md sm:max-w-xl mb-8 text-sm sm:text-base"
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
          href="/auth/register"
          className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-xl font-medium transition-transform hover:scale-105"
        >
          Start Learning Free
        </Link>
        <Link
          href="#how"
          className="border border-border hover:border-primary px-6 py-3 rounded-xl font-medium text-white transition-transform hover:scale-105"
        >
          See How It Works
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-12 sm:mt-16 w-full flex justify-center"
      >
       <div className="size-max">
          <Image
            src="/images/hero-dashboard.webp"
            alt="StudyMate Dashboard"
            width={300}
            height={175}
            className="rounded-2xl shadow-xl border border-border w-full h-auto"
          />
       </div>
      </motion.div>
    </section>
  );
}
