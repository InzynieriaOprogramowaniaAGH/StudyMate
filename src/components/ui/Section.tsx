import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motionutils";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, children, className }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.section>
  );
}
