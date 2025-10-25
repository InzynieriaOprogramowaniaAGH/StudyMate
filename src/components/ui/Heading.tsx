import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motionutils";

interface HeadingProps {
  children: React.ReactNode;
  size?: "lg" | "xl";
  gradient?: boolean;
}

export function Heading({ children, size = "xl", gradient = false }: HeadingProps) {
  const sizeClass = size === "xl" ? "text-4xl md:text-5xl" : "text-3xl";
  const gradientClass = gradient
    ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
    : "text-white";

  return (
    <motion.h2
      variants={fadeInUp}
      className={`${sizeClass} font-bold mb-8 ${gradientClass}`}
    >
      {children}
    </motion.h2>
  );
}
