import comparisonsData from "@/data/comparisons.json";
import { Comparison } from "@/types/comparison";
import { Food } from "@/types/food";
import { WorkoutResult } from "@/types/result";
import { formatDistance, formatDuration, formatFloors, formatCalories } from "./formatting";
import { shuffle, pickRandom } from "@/utils/random";

const comparisons = comparisonsData as Comparison[];

export function pickComparisons(calories: number, count: number): string[] {
  const eligible = comparisons.filter(
    (c) => calories >= c.minCalories && calories <= c.maxCalories
  );
  const pool = eligible.length >= count ? eligible : comparisons;
  return shuffle(pool)
    .slice(0, count)
    .map((c) => c.text);
}

export function pickFact(
  food: Food,
  workouts: WorkoutResult[],
  calories: number
): string {
  const run = workouts.find((w) => w.activity.id === "running");
  const swim = workouts.find((w) => w.activity.id === "swimming");
  const stairs = workouts.find((w) => w.activity.id === "stair-climbing");
  const dance = workouts.find((w) => w.activity.id === "dancing");

  const templated: string[] = [];
  if (run?.distanceKm) {
    templated.push(
      `${food.name} costs about ${formatDistance(run.distanceKm)} of running to earn back.`
    );
  }
  if (swim) {
    templated.push(
      `You'd need to swim for ${formatDuration(swim.minutes)} straight to burn this off.`
    );
  }
  if (stairs?.floors) {
    templated.push(
      `That's the same as climbing ${formatFloors(stairs.floors)} — no elevator allowed.`
    );
  }
  if (dance) {
    templated.push(`Or you could just dance it off for ${formatDuration(dance.minutes)}.`);
  }

  const eligibleComparisons = comparisons
    .filter((c) => calories >= c.minCalories && calories <= c.maxCalories)
    .map((c) => c.text);

  const pool = [...templated, ...eligibleComparisons];
  if (pool.length === 0) {
    return `This meal is worth ${formatCalories(calories)} calories of pure effort.`;
  }
  return pickRandom(pool);
}
