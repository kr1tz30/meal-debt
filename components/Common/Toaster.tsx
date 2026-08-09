"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex items-center gap-2 rounded-btn bg-ink text-bg px-4 py-3 shadow-lift text-sm font-medium"
          >
            <Check size={16} className="text-accent" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
