"use client";

import { Shuffle, Search, TrendingUp } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getRandomFood, getTrendingFoods } from "@/lib/search";

export function ContinueExploring() {
  const selectFood = useAppStore((s) => s.selectFood);
  const startReveal = useAppStore((s) => s.startReveal);
  const reset = useAppStore((s) => s.reset);

  const actions = [
    {
      label: "I'm Feeling Hungry",
      icon: Shuffle,
      onClick: () => {
        selectFood(getRandomFood());
        startReveal();
      },
    },
    {
      label: "Search Another Meal",
      icon: Search,
      onClick: reset,
    },
    {
      label: "Today's Hardest Meal",
      icon: TrendingUp,
      onClick: () => {
        selectFood(getTrendingFoods(1)[0]);
        startReveal();
      },
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {actions.map(({ label, icon: Icon, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="inline-flex items-center gap-2 rounded-btn border border-ink/10 dark:border-white/10 bg-card dark:bg-card-dark px-5 py-3 text-sm font-medium shadow-soft hover:border-accent/40 hover:text-accent transition-colors"
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}
