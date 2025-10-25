"use client";

import { motion } from "framer-motion";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <Header />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
      </motion.div>
    </main>
  );
}
