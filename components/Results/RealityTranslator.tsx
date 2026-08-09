"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { springReveal } from "@/animations/transitions";
import { cardHover } from "@/animations/hover";

interface RealityTranslatorProps {
  translations: string[];
}

export function RealityTranslator({ translations }: RealityTranslatorProps) {
  if (translations.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles size={18} className="text-accent" />
        <h3 className="text-xl md:text-2xl font-bold">This meal also equals...</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {translations.map((text, i) => (
          <motion.div
            key={text}
            custom={i}
            variants={springReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            whileHover={cardHover}
            className="rounded-card bg-card dark:bg-card-dark border border-ink/[0.06] dark:border-white/[0.08] shadow-soft px-6 py-5 text-[15px] leading-relaxed"
          >
            {text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
