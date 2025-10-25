"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Ava Johnson",
      role: "Medical Student",
      quote:
        "StudyMate completely changed the way I review my notes. The AI flashcards are scary accurate and save me hours!",
      image: "/images/avatar1.jpg",
      rating: 5,
    },
    {
      name: "Liam Chen",
      role: "Computer Science Major",
      quote:
        "The quiz generator makes it so easy to test myself before exams. My grades have never been better.",
      image: "/images/avatar2.jpg",
      rating: 4,
    },
    {
      name: "Sofia Martínez",
      role: "High School Student",
      quote:
        "I love how simple and clean it feels. I use StudyMate every day on my phone — totally seamless!",
      image: "/images/avatar3.jpg",
      rating: 5,
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-24 px-4 sm:px-8 bg-bg-light text-center text-white"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-16"
      >
        What <span className="text-accent">Students</span> Say
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{
              y: -5,
              boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
              scale: 1.02,
              transition: { type: "spring", stiffness: 150, damping: 12 },
            }}
            className="relative p-8 bg-bg rounded-2xl border border-border cursor-pointer text-left flex flex-col items-start"
          >
            {/* Quote icon */}
            <motion.div
              variants={itemVariants}
              className="absolute top-4 right-4 text-primary"
            >
              <Quote size={36} strokeWidth={1.5} />
            </motion.div>

            {/* User info */}
            <motion.div
              variants={itemVariants}
              className="flex items-center mb-4 z-10"
            >
              <Image
                src={t.image}
                alt={t.name}
                width={48}
                height={48}
                className="rounded-full mr-3 border border-border"
              />
              <div>
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-muted text-sm">{t.role}</p>
              </div>
            </motion.div>

            {/* Star rating */}
            <motion.div variants={itemVariants} className="flex mb-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <motion.svg
                  key={idx}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={idx < t.rating ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={`w-5 h-5 ${
                    idx < t.rating ? "text-accent" : "text-gray-600"
                  }`}
                  whileHover={{ scale: 1.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 4.305a.563.563 0 00.424.308l4.756.692a.563.563 0 01.312.96l-3.44 3.35a.563.563 0 00-.162.498l.812 4.73a.562.562 0 01-.815.592l-4.25-2.234a.563.563 0 00-.524 0l-4.25 2.234a.562.562 0 01-.815-.592l.812-4.73a.563.563 0 00-.162-.498l-3.44-3.35a.563.563 0 01.312-.96l4.756-.692a.563.563 0 00.424-.308L11.48 3.5z"
                  />
                </motion.svg>
              ))}
            </motion.div>

            {/* Quote */}
            <motion.p variants={itemVariants} className="text-muted italic z-10">
              “{t.quote}”
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
