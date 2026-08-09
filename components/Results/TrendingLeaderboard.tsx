"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { getHardestFoodsToday } from "@/lib/search";
import { getQuickPreview } from "@/lib/calculations";
import { formatWorkoutShort } from "@/lib/formatting";
import { useAppStore } from "@/store/useAppStore";

export function TrendingLeaderboard() {
  const foods = getHardestFoodsToday(5);
  const selectFood = useAppStore((s) => s.selectFood);
  const startReveal = useAppStore((s) => s.startReveal);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Flame size={18} className="text-accent" />
        <h3 className="text-xl md:text-2xl font-bold">Hardest Meals To Burn Today</h3>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-2x px-2x snap-x snap-mandatory">
        {foods.map((food, i) => {
          const preview = getQuickPreview(food);
          return (
            <motion.button
              key={food.id}
              onClick={() => {
                selectFood(food);
                startReveal();
              }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="snap-start shrink-0 w-[240px] flex items-center gap-4 rounded-card bg-card dark:bg-card-dark border border-ink/[0.06] dark:border-white/[0.08] shadow-soft px-5 py-4 text-left"
            >
              <span className="text-2xl font-bold text-accent/70 w-6 shrink-0 tabular-nums">
                {i + 1}
              </span>
              <span className="text-3xl leading-none shrink-0">{food.emoji}</span>
              <span className="min-w-0">
                <span className="block font-semibold text-[15px] truncate">{food.name}</span>
                <span className="block text-xs text-muted truncate">
                  {formatWorkoutShort(preview)}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
