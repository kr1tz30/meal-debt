"use client";

import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { SearchBar } from "@/components/Search/SearchBar";
import { QuantitySelector } from "@/components/Quantity/QuantitySelector";
import { RevealButton } from "./RevealButton";
import { TonightsSpecials } from "./TonightsSpecials";
import { KitchenInterior } from "@/components/Story/KitchenInterior";
import { MascotTruffle } from "@/components/Story/MascotTruffle";
import { useAppStore } from "@/store/useAppStore";
import { getRandomFood } from "@/lib/search";
import { fadeIn, slideUp, staggerContainer } from "@/animations/transitions";

export function Hero() {
  const selectFood = useAppStore((s) => s.selectFood);

  function feelingHungry() {
    selectFood(getRandomFood());
  }

  return (
    <motion.section
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="relative min-h-[92vh] flex flex-col items-center justify-center px-2x md:px-4x pt-24 pb-16 overflow-hidden"
    >
      <KitchenInterior className="absolute inset-0" floorHeightClass="h-[30%]" />
      <div className="absolute inset-0 bg-black/10" />

      <div className="hidden lg:block absolute bottom-0 left-6 xl:left-16 z-10">
        <MascotTruffle size={150} waving={false} />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-hero flex flex-col items-center text-center gap-8"
      >
        <motion.h1
          variants={slideUp}
          className="text-balance font-display text-[40px] leading-[1.1] sm:text-6xl md:text-7xl lg:text-[76px] font-bold tracking-tight text-card"
        >
          What Does Your
          <br />
          Meal Cost?
        </motion.h1>

        <motion.p
          variants={slideUp}
          className="text-balance max-w-xl text-lg md:text-[22px] text-card/75 font-medium"
        >
          Calories don&apos;t mean much.
          <br className="sm:hidden" /> Running 8 kilometres does.
        </motion.p>

        <motion.div variants={slideUp} className="w-full pt-2">
          <TonightsSpecials />
        </motion.div>

        <motion.div variants={slideUp} className="w-full max-w-2xl">
          <SearchBar />
        </motion.div>

        <motion.div
          variants={slideUp}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <QuantitySelector />
          <RevealButton />
        </motion.div>

        <motion.button
          variants={slideUp}
          onClick={feelingHungry}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-card/70 hover:text-gold transition-colors"
        >
          <Shuffle size={14} />
          I&apos;m Feeling Hungry
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
