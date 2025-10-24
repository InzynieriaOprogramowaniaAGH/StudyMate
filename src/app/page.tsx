"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp} from "../lib/motionutils";


const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* === Header === */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          StudyMate
        </Link>
        <nav className="hidden md:flex space-x-6 text-gray-300">
          <Link href="#features" className="hover:text-white">
            Features
          </Link>
          <Link href="#how" className="hover:text-white">
            How It Works
          </Link>
          <Link href="#testimonials" className="hover:text-white">
            Testimonials
          </Link>
          <Link href="#contact" className="hover:text-white">
            Help
          </Link>
        </nav>
        <div className="space-x-3">
          <Link href="/login" className="text-gray-300 hover:text-white">
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* === Hero Section === */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={fadeInUp}

        className="flex flex-col items-center text-center py-24 px-6 bg-gradient-to-b from-gray-950 to-gray-900"
      >
        <motion.span
          variants={fadeInUp}

          className="bg-blue-950/40 text-blue-400 text-sm px-3 py-1 rounded-full mb-4"
        >
          🤖 AI-Powered Learning
        </motion.span>

        <motion.h1
          variants={fadeInUp}

          className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        >
          Study Smarter with Your AI Assistant
        </motion.h1>

        <motion.p
          variants={fadeInUp}

          className="text-gray-400 max-w-xl mb-8"
        >
          Transform your notes into interactive quizzes and flashcards automatically. 
          Let AI help you learn faster and retain more.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/signup"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-medium transition"
          >
            Start Learning Free
          </Link>
          <Link
            href="#how"
            className="border border-gray-700 hover:border-blue-500 px-6 py-3 rounded-xl font-medium transition"
          >
            See How It Works
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16"
        >
          <Image
            src="/images/hero-dashboard.webp"
            alt="StudyMate Dashboard"
            width={300}
            height={200}
            className="rounded-2xl shadow-xl border border-gray-800"
          />
        </motion.div>
      </motion.section>

      {/* === Features Section === */}
<motion.section
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  variants={fadeInUp}
  className="py-24 px-6 bg-gray-900 text-center"
>
  <motion.h2
    className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
  >
    Powerful AI Features
  </motion.h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    <motion.div
      className="p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-blue-500 transition"
    >
      <h3 className="text-xl font-semibold mb-3 text-blue-400">AI Flashcards</h3>
      <p className="text-gray-400">
        Automatically turn your notes into smart, reviewable flashcards with spaced repetition.
      </p>
    </motion.div>

    <motion.div
      className="p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-blue-500 transition"
    >
      <h3 className="text-xl font-semibold mb-3 text-blue-400">Quiz Generator</h3>
      <p className="text-gray-400">
        Generate personalized quizzes to test your understanding in seconds.
      </p>
    </motion.div>

    <motion.div

      className="p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-blue-500 transition"
    >
      <h3 className="text-xl font-semibold mb-3 text-blue-400">AI Summaries</h3>
      <p className="text-gray-400">
        Summarize any topic into digestible, easy-to-study key points with AI.
      </p>
    </motion.div>
  </div>
</motion.section>


      {/* === How It Works === */}
      <motion.section
        id="how"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-24 text-center px-8"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-3xl font-bold mb-12"
        >
          How StudyMate Works
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            ["Create Your Notes", "Write or paste your study material into our note editor."],
            ["AI Does the Work", "AI generates quizzes, flashcards, and summaries."],
            ["Study & Excel", "Practice with interactive quizzes and track progress."],
          ].map(([title, desc], i) => (
            <motion.div key={i} variants={fadeInUp}>
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {i + 1}
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* === Testimonials === */}
      <motion.section
        id="testimonials"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-24 bg-gray-900 px-8"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-center text-3xl font-bold mb-12"
        >
          Loved by Students Everywhere
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            ["Sarah K.", "Medical Student", "StudyMate helped me ace my exams! The AI quizzes are spot-on."],
            ["Michael T.", "Engineering Student", "Flashcards with spaced repetition changed my learning game."],
            ["Emma L.", "Law Student", "Automatic summaries save hours of work. Total lifesaver!"],
          ].map(([name, role, quote], i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition"
            >
              <p className="text-gray-300 italic mb-4">“{quote}”</p>
              <p className="text-sm text-gray-400">
                — <span className="text-white font-semibold">{name}</span>, {role}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* === CTA === */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-24 text-center px-8"
      >
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Study Habits?
        </h2>
        <p className="text-gray-400 mb-8">
          Join thousands of students who are learning smarter with StudyMate.
        </p>
        <Link
          href="/signup"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition"
        >
          Get Started for Free
        </Link>
      </motion.section>

      {/* === Footer === */}
      <footer className="border-t border-gray-800 py-8 px-8 text-gray-400 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 StudyMate. All rights reserved.</p>
          <div className="space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
