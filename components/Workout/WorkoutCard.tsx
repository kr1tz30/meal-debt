"use client";

import { motion } from "framer-motion";
import { WorkoutResult } from "@/types/result";
import { formatWorkoutMetrics } from "@/lib/formatting";
import { cardHover, cardTap } from "@/animations/hover";
import { springReveal } from "@/animations/transitions";

interface WorkoutCardProps {
  workout: WorkoutResult;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

export function WorkoutCard({ workout, index, selected, onSelect }: WorkoutCardProps) {
  const { activity } = workout;
  const { headline, sub } = formatWorkoutMetrics(workout);

  return (
    <motion.button
      type="button"
      custom={index}
      variants={springReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={cardHover}
      whileTap={cardTap}
      onClick={onSelect}
      className={`relative flex flex-col items-start gap-3 rounded-card bg-card dark:bg-card-dark border p-6 text-left shadow-soft transition-colors ${
        selected
          ? "border-accent shadow-glow"
          : "border-ink/[0.06] dark:border-white/[0.08] hover:border-ink/[0.12]"
      }`}
    >
      <div
        className="w-12 h-12 rounded-2xl grid place-items-center text-2xl"
        style={{ backgroundColor: `${activity.color}1A` }}
      >
        {activity.emoji}
      </div>

      <div>
        <p className="text-sm font-medium text-muted">{activity.name}</p>
        <p className="text-[28px] font-bold leading-tight tracking-tight tabular-nums">
          {headline}
        </p>
        {sub && <p className="text-sm text-muted mt-0.5">{sub}</p>}
      </div>

      <p className="text-[13px] text-muted leading-snug">{activity.description}</p>

      {selected && (
        <motion.div
          layoutId="selected-workout-glow"
          className="pointer-events-none absolute inset-0 rounded-card ring-2 ring-accent/40"
        />
      )}
    </motion.button>
  );
}
