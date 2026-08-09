"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { MAX_QUANTITY, MIN_QUANTITY } from "@/lib/config";

export function QuantitySelector() {
  const quantity = useAppStore((s) => s.quantity);
  const increment = useAppStore((s) => s.incrementQuantity);
  const decrement = useAppStore((s) => s.decrementQuantity);
  const selectedFood = useAppStore((s) => s.selectedFood);

  return (
    <div className="flex items-center gap-1 bg-card dark:bg-card-dark rounded-qty border-2 border-gold/40 shadow-soft p-1.5 select-none">
      <button
        onClick={decrement}
        disabled={quantity <= MIN_QUANTITY}
        aria-label="Decrease quantity"
        className="w-11 h-11 grid place-items-center rounded-[14px] text-ink dark:text-ink-dark hover:bg-ink/[0.05] dark:hover:bg-white/[0.08] disabled:opacity-30 disabled:pointer-events-none transition-colors active:scale-95"
      >
        <Minus size={18} />
      </button>

      <div className="w-16 text-center overflow-hidden h-8 relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={quantity}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute inset-0 flex items-center justify-center text-lg font-bold tabular-nums"
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </div>

      <button
        onClick={increment}
        disabled={quantity >= MAX_QUANTITY}
        aria-label="Increase quantity"
        className="w-11 h-11 grid place-items-center rounded-[14px] text-ink dark:text-ink-dark hover:bg-ink/[0.05] dark:hover:bg-white/[0.08] disabled:opacity-30 disabled:pointer-events-none transition-colors active:scale-95"
      >
        <Plus size={18} />
      </button>

      {selectedFood && (
        <span className="hidden sm:block pl-2 pr-3 text-sm text-muted whitespace-nowrap">
          {selectedFood.servingName}
        </span>
      )}
    </div>
  );
}
