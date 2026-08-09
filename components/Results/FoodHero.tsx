"use client";

import { motion } from "framer-motion";
import { Food } from "@/types/food";
import { formatQuantityLabel } from "@/lib/formatting";

interface FoodHeroProps {
  food: Food;
  quantity: number;
}

export function FoodHero({ food, quantity }: FoodHeroProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="text-[100px] md:text-[130px] leading-none drop-shadow-xl animate-float"
      >
        {food.emoji}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold tracking-tight"
      >
        {formatQuantityLabel(food.name, quantity)}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted text-sm"
      >
        {food.category} · {food.cuisine}
      </motion.p>
    </div>
  );
}
