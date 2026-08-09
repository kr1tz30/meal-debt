"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Settings2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function WeightAdjuster() {
  const [open, setOpen] = useState(false);
  const weightKg = useAppStore((s) => s.weightKg);
  const setWeight = useAppStore((s) => s.setWeight);

  return (
    <div id="advanced-options" className="w-full max-w-xs mx-auto">
      <button
        onClick={() => setOpen((o) => !o)}
        className="mx-auto flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink dark:hover:text-ink-dark transition-colors"
      >
        <Settings2 size={13} />
        Advanced Options
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <label htmlFor="weight-range" className="text-muted whitespace-nowrap">
                Body weight
              </label>
              <input
                id="weight-range"
                type="range"
                min={30}
                max={150}
                value={weightKg}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-32 accent-accent"
              />
              <span className="font-semibold tabular-nums w-16">{weightKg} kg</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
