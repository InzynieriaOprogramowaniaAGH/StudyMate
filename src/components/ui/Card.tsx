import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motionutils";

interface CardProps {
  title: string;
  description: string;
}

export function Card({ title, description }: CardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-blue-500 transition"
    >
      <h3 className="text-xl font-semibold mb-3 text-blue-400">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}
