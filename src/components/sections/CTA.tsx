"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp } from "@/lib/motionutils";
import { useTranslations } from "next-intl";

export default function CTA() {
  const t = useTranslations("cta");

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="py-20 sm:py-24 text-center px-4 sm:px-8 bg-bg text-text"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-clarity text-primary">
        {t("title")}
      </h2>
      <p className="text-sm sm:text-base text-muted mb-8 font-clarity">
        {t("subtitle")}
      </p>
      <Link
        href="/auth/register"
        className="bg-primary hover:bg-accent text-white px-5 sm:px-6 py-3 rounded-xl font-medium transition"
      >
        {t("button")}
      </Link>
    </motion.section>
  );
}
