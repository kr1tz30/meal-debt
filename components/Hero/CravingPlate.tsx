"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Food } from "@/types/food";
import { DishArt } from "@/components/Illustrations/DishArt";

interface CravingPlateProps {
  food: Food | null;
}

const STEAM = [
  { x: -14, delay: 0 },
  { x: 0, delay: 0.5 },
  { x: 14, delay: 1 },
];

export function CravingPlate({ food }: CravingPlateProps) {
  return (
    <div className="relative w-[200px] h-[200px] shrink-0">
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        <ellipse cx="100" cy="108" rx="88" ry="84" fill="black" opacity="0.16" />
        <circle cx="100" cy="100" r="90" fill="#FFFBF2" stroke="#C9972E" strokeWidth="4" />
        <circle cx="100" cy="100" r="72" fill="#F1E6CE" />
        <circle cx="100" cy="100" r="72" fill="url(#plateShade)" />
        <defs>
          <radialGradient id="plateShade" cx="35%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.06" />
          </radialGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {food ? (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, scale: 0.3, rotate: -20, y: 22 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, rotate: 20, y: -22 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative"
            >
              {STEAM.map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute -top-3 left-1/2 w-1.5 h-1.5 rounded-full bg-white/70"
                  style={{ marginLeft: s.x }}
                  animate={{ opacity: [0, 0.7, 0], y: [-2, -34], scale: [0.6, 1.4] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: s.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
              <div className="drop-shadow-md">
                <DishArt food={food} size={140} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-5xl opacity-25"
            >
              🍽️
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
