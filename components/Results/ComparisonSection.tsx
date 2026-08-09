"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Food } from "@/types/food";
import { getRandomFoodPair } from "@/lib/search";
import { getQuickPreview } from "@/lib/calculations";
import { formatCalories, formatWorkoutShort } from "@/lib/formatting";
import { useAppStore } from "@/store/useAppStore";
import { cardHover } from "@/animations/hover";

function ComparisonCard({
  food,
  revealed,
  isWinner,
  onReveal,
  onExplore,
}: {
  food: Food;
  revealed: boolean;
  isWinner: boolean;
  onReveal: () => void;
  onExplore: () => void;
}) {
  const preview = getQuickPreview(food);

  return (
    <motion.button
      type="button"
      onClick={revealed ? onExplore : onReveal}
      whileHover={cardHover}
      whileTap={{ scale: 0.97 }}
      className={`relative flex-1 flex flex-col items-center gap-3 rounded-card bg-card dark:bg-card-dark border p-8 text-center shadow-soft transition-colors ${
        revealed && isWinner
          ? "border-accent shadow-glow"
          : "border-ink/[0.06] dark:border-white/[0.08]"
      }`}
    >
      {revealed && isWinner && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent text-white text-[11px] font-bold px-3 py-1 shadow-card">
          HURTS MORE
        </span>
      )}
      <span className="text-6xl leading-none">{food.emoji}</span>
      <span className="font-semibold text-lg">{food.name}</span>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden flex flex-col items-center gap-1"
          >
            <span className="text-sm text-muted pt-1">
              {formatCalories(food.calories)} kcal
            </span>
            <span className="text-xs text-muted">≈ {formatWorkoutShort(preview)}</span>
            <span className="text-xs font-medium text-accent pt-1">
              Tap to explore this meal →
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function ComparisonSection() {
  const [pair, setPair] = useState<[Food, Food]>(() => getRandomFoodPair());
  const [revealed, setRevealed] = useState(false);
  const selectFood = useAppStore((s) => s.selectFood);
  const startReveal = useAppStore((s) => s.startReveal);

  const winner = pair[0].calories >= pair[1].calories ? pair[0].id : pair[1].id;

  function reshuffle() {
    setPair(getRandomFoodPair());
    setRevealed(false);
  }

  function explore(food: Food) {
    selectFood(food);
    startReveal();
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-3 mb-6">
        <h3 className="text-xl md:text-2xl font-bold">What Hurts More?</h3>
        <button
          onClick={reshuffle}
          aria-label="Shuffle comparison"
          className="p-1.5 rounded-full text-muted hover:text-accent hover:bg-accent/10 transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-2 relative">
        <ComparisonCard
          food={pair[0]}
          revealed={revealed}
          isWinner={winner === pair[0].id}
          onReveal={() => setRevealed(true)}
          onExplore={() => explore(pair[0])}
        />
        <div className="hidden sm:flex items-center justify-center px-2 text-muted font-bold text-sm">
          VS
        </div>
        <ComparisonCard
          food={pair[1]}
          revealed={revealed}
          isWinner={winner === pair[1].id}
          onReveal={() => setRevealed(true)}
          onExplore={() => explore(pair[1])}
        />
      </div>
    </div>
  );
}
