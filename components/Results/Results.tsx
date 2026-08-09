"use client";

import { motion } from "framer-motion";
import { MealResult } from "@/types/result";
import { FoodHero } from "./FoodHero";
import { CaloriesCard } from "./CaloriesCard";
import { WeightAdjuster } from "./WeightAdjuster";
import { WorkoutGrid } from "@/components/Workout/WorkoutGrid";
import { RealityTranslator } from "./RealityTranslator";
import { InterestingFact } from "./InterestingFact";
import { ComparisonSection } from "./ComparisonSection";
import { TrendingLeaderboard } from "./TrendingLeaderboard";
import { ShareSection } from "@/components/Share/ShareSection";
import { ContinueExploring } from "./ContinueExploring";
import { Disclaimer } from "@/components/Common/Disclaimer";
import { useAppStore } from "@/store/useAppStore";

interface ResultsProps {
  result: MealResult;
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full max-w-content mx-auto px-2x md:px-4x py-10 md:py-14 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function Results({ result }: ResultsProps) {
  const weightKg = useAppStore((s) => s.weightKg);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="pt-28"
    >
      <Section className="flex flex-col items-center gap-10 pb-4">
        <FoodHero food={result.food} quantity={result.quantity} />
        <CaloriesCard calories={result.totalCalories} weightKg={weightKg} />
        <WeightAdjuster />
      </Section>

      <Section>
        <WorkoutGrid workouts={result.workouts} weightKg={weightKg} />
      </Section>

      <Section>
        <RealityTranslator translations={result.translations} />
      </Section>

      <Section>
        <InterestingFact fact={result.fact} />
      </Section>

      <Section>
        <ComparisonSection />
      </Section>

      <Section>
        <TrendingLeaderboard />
      </Section>

      <Section className="bg-card/40 dark:bg-card-dark/40 rounded-[40px]">
        <ShareSection result={result} />
      </Section>

      <Section className="flex flex-col items-center gap-8">
        <ContinueExploring />
        <Disclaimer />
      </Section>
    </motion.div>
  );
}
