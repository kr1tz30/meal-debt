"use client";

import { motion } from "framer-motion";

interface InterestingFactProps {
  fact: string;
}

export function InterestingFact({ fact }: InterestingFactProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-balance max-w-2xl mx-auto text-center text-lg md:text-xl font-medium text-ink dark:text-ink-dark"
    >
      &ldquo;{fact}&rdquo;
    </motion.div>
  );
}
