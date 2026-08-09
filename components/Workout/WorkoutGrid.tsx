"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WorkoutResult } from "@/types/result";
import { WorkoutCard } from "./WorkoutCard";
import { formatDuration, formatCalories } from "@/lib/formatting";

interface WorkoutGridProps {
  workouts: WorkoutResult[];
  weightKg: number;
}

export function WorkoutGrid({ workouts, weightKg }: WorkoutGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = workouts.find((w) => w.activity.id === selectedId) ?? null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {workouts.map((workout, i) => (
          <WorkoutCard
            key={workout.activity.id}
            workout={workout}
            index={i}
            selected={selectedId === workout.activity.id}
            onSelect={() =>
              setSelectedId((id) => (id === workout.activity.id ? null : workout.activity.id))
            }
          />
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Tap a card to choose your punishment.
      </p>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="rounded-card bg-accent/[0.06] border border-accent/20 p-6 flex flex-wrap items-center gap-x-10 gap-y-3">
              <p className="font-semibold text-accent">
                Great choice — {selected.activity.name.toLowerCase()} it is.
              </p>
              <div className="flex gap-8 text-sm">
                <div>
                  <p className="text-muted">Est. Time</p>
                  <p className="font-semibold">{formatDuration(selected.minutes)}</p>
                </div>
                <div>
                  <p className="text-muted">Calories / Hour</p>
                  <p className="font-semibold">
                    {formatCalories(Math.round(selected.activity.met * weightKg))} kcal
                  </p>
                </div>
                <div>
                  <p className="text-muted">Total to Burn</p>
                  <p className="font-semibold">{formatCalories(selected.caloriesBurned)} kcal</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
