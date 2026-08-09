"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { ANIMATION } from "@/lib/config";

const LOADING_MESSAGES = [
  "Calculating effort...",
  "Estimating calories...",
  "Matching workouts...",
  "Almost done...",
];

const BURST_EMOJI = ["🏃", "🚴", "🏊", "🪜", "🏋️", "🧘"];

export function RevealAnimation() {
  const selectedFood = useAppStore((s) => s.selectedFood);
  const finishReveal = useAppStore((s) => s.finishReveal);
  const [stage, setStage] = useState<"glow" | "crack" | "burst">("glow");
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const totalMs = ANIMATION.revealSequence * 1000;
    const t1 = setTimeout(() => setStage("crack"), totalMs * 0.42);
    const t2 = setTimeout(() => setStage("burst"), totalMs * 0.62);
    const t3 = setTimeout(() => finishReveal(), totalMs);
    const msgInterval = setInterval(
      () => setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length),
      totalMs / LOADING_MESSAGES.length
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(msgInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!selectedFood) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-bg/90 dark:bg-bg-dark/90 backdrop-blur-md"
    >
      <div className="relative flex items-center justify-center w-[280px] h-[280px]">
        {/* radial glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-accent/25 blur-3xl"
          animate={{
            scale: stage === "glow" ? [1, 1.15, 1] : 1.3,
            opacity: stage === "burst" ? 0 : [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 1.4, repeat: stage === "glow" ? Infinity : 0 }}
        />

        {/* crumb / burst particles */}
        <AnimatePresence>
          {stage !== "glow" &&
            BURST_EMOJI.map((emoji, i) => {
              const angle = (i / BURST_EMOJI.length) * Math.PI * 2;
              const distance = stage === "burst" ? 170 : 40;
              return (
                <motion.span
                  key={emoji}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: stage === "burst" ? 1 : 0.6,
                    scale: stage === "burst" ? 1 : 0.5,
                    rotate: stage === "burst" ? [0, 15, -10, 0] : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 14,
                    delay: i * 0.06,
                  }}
                  className="absolute text-3xl"
                >
                  {emoji}
                </motion.span>
              );
            })}
        </AnimatePresence>

        {/* the food itself */}
        <motion.div
          animate={{
            scale: stage === "glow" ? [1, 1.06, 1] : stage === "crack" ? [1, 1.15, 0.95, 1.05] : 0.85,
            rotate: stage === "crack" ? [0, -4, 4, -2, 0] : 0,
            opacity: stage === "burst" ? 0.5 : 1,
          }}
          transition={{
            duration: stage === "glow" ? 1.6 : 0.5,
            repeat: stage === "glow" ? Infinity : 0,
          }}
          className="relative z-10 text-[120px] leading-none drop-shadow-2xl"
        >
          {selectedFood.emoji}
        </motion.div>
      </div>

      <div className="mt-10 h-6 relative w-64 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-0 text-sm font-medium tracking-wide text-muted"
          >
            {LOADING_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.section>
  );
}
