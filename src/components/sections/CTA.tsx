"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp } from "@/lib/motionutils";

export default function CTA() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="py-24 text-center px-8 bg-bg text-text"
    >
      <h2 className="text-3xl font-bold mb-6 font-clarity text-primary">
        Ready to Transform Your Study Habits?
      </h2>
      <p className="text-muted mb-8 font-clarity">
        Join thousands of students who are learning smarter with StudyMate.
      </p>
      <Link
        href="/signup"
        className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-xl font-medium transition"
      >
        Get Started for Free
      </Link>
    </motion.section>
  );
}
