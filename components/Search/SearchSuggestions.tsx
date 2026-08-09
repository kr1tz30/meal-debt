"use client";

import { motion } from "framer-motion";
import { Food } from "@/types/food";
import { formatCalories } from "@/lib/formatting";

interface SearchSuggestionsProps {
  foods: Food[];
  highlightedIndex: number;
  onHover: (index: number) => void;
  onSelect: (food: Food) => void;
  label?: string;
}

export function SearchSuggestions({
  foods,
  highlightedIndex,
  onHover,
  onSelect,
  label,
}: SearchSuggestionsProps) {
  if (foods.length === 0) return null;

  return (
    <div className="py-2">
      {label && (
        <div className="px-5 pb-1.5 pt-1 text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </div>
      )}
      <ul role="listbox">
        {foods.map((food, index) => {
          const active = index === highlightedIndex;
          return (
            <li key={food.id} role="option" aria-selected={active}>
              <motion.button
                type="button"
                onMouseEnter={() => onHover(index)}
                onClick={() => onSelect(food)}
                initial={false}
                animate={{ backgroundColor: active ? "rgba(255,107,53,0.08)" : "rgba(0,0,0,0)" }}
                transition={{ duration: 0.12 }}
                className="w-full flex items-center gap-3.5 px-5 py-3 text-left"
              >
                <span className="text-2xl leading-none shrink-0" aria-hidden>
                  {food.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-[15px] truncate">{food.name}</span>
                  <span className="block text-[13px] text-muted truncate">
                    ≈ {formatCalories(food.calories)} kcal · {food.servingName}
                  </span>
                </span>
                <span className="shrink-0 text-[11px] font-medium text-muted bg-ink/[0.04] dark:bg-white/[0.06] rounded-full px-2.5 py-1">
                  {food.category}
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
