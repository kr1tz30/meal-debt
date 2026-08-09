"use client";

import { motion } from "framer-motion";
import { useCounter } from "@/hooks/useCounter";
import { formatCalories } from "@/lib/formatting";

interface CaloriesCardProps {
  calories: number;
  weightKg: number;
}

export function CaloriesCard({ calories, weightKg }: CaloriesCardProps) {
  const animated = useCounter(calories, 1.1);

  return (
    <div className="flex flex-col items-center text-center gap-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        Approximate Energy
      </p>
      <p className="text-5xl md:text-6xl font-bold tabular-nums tracking-tight">
        {formatCalories(animated)}{" "}
        <span className="text-2xl md:text-3xl font-semibold text-muted">kcal</span>
      </p>
      <p className="text-sm text-muted">
        Based on a {weightKg} kg adult, {" "}
        <a
          href="#advanced-options"
          className="underline decoration-dotted underline-offset-4 hover:text-accent"
        >
          adjust weight
        </a>
      </p>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-balance mt-6 max-w-xl text-2xl md:text-[32px] font-bold leading-snug"
      >
        Here&apos;s what your body needs to do to earn this meal.
      </motion.h3>
    </div>
  );
}
