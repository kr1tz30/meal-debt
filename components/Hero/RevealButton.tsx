"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { buttonHover, buttonTap } from "@/animations/hover";

export function RevealButton() {
  const selectedFood = useAppStore((s) => s.selectedFood);
  const startReveal = useAppStore((s) => s.startReveal);

  return (
    <motion.button
      type="button"
      disabled={!selectedFood}
      onClick={startReveal}
      whileHover={selectedFood ? buttonHover : undefined}
      whileTap={selectedFood ? buttonTap : undefined}
      className="group inline-flex items-center justify-center gap-2.5 rounded-btn bg-accent border-2 border-gold px-8 py-4 text-[17px] font-semibold text-white shadow-card hover:shadow-lift disabled:opacity-40 disabled:pointer-events-none transition-shadow"
    >
      Reveal The Cost
      <ArrowRight
        size={19}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </motion.button>
  );
}
