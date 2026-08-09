import { Food } from "@/types/food";
import { Activity } from "@/types/activity";
import { WorkoutResult, MealResult } from "@/types/result";
import { computeFoodTotals } from "./calories";
import { minutesToBurnCalories } from "./met";
import { minutesToDistanceKm, minutesToFloors } from "./converters";
import { DEFAULT_WEIGHT_KG, RESULT_ACTIVITY_ORDER, RESULT_CARD_COUNT } from "./config";
import { pickComparisons, pickFact } from "./comparisons";
import activitiesData from "@/data/activities.json";

const activities = activitiesData as Activity[];

export function calculateWorkout(
  activity: Activity,
  calories: number,
  weightKg: number = DEFAULT_WEIGHT_KG
): WorkoutResult {
  const minutes = minutesToBurnCalories(activity.met, weightKg, calories);
  return {
    activity,
    minutes,
    distanceKm: activity.displayType === "distance" ? minutesToDistanceKm(minutes, activity) : undefined,
    floors: activity.displayType === "floors" ? minutesToFloors(minutes) : undefined,
    caloriesBurned: Math.round(calories),
  };
}

export function calculateAllWorkouts(
  calories: number,
  weightKg: number = DEFAULT_WEIGHT_KG
): WorkoutResult[] {
  const ordered = [...activities].sort(
    (a, b) => RESULT_ACTIVITY_ORDER.indexOf(a.id) - RESULT_ACTIVITY_ORDER.indexOf(b.id)
  );
  return ordered
    .slice(0, RESULT_CARD_COUNT)
    .map((activity) => calculateWorkout(activity, calories, weightKg));
}

export function getQuickPreview(food: Food, quantity: number = 1, weightKg: number = DEFAULT_WEIGHT_KG) {
  const calories = Math.round(food.calories * quantity);
  const preferred = ["running", "swimming", "cycling"];
  for (const id of preferred) {
    const activity = activities.find((a) => a.id === id);
    if (!activity) continue;
    const workout = calculateWorkout(activity, calories, weightKg);
    return workout;
  }
  return calculateWorkout(activities[0], calories, weightKg);
}

export function buildMealResult(
  food: Food,
  quantity: number,
  weightKg: number = DEFAULT_WEIGHT_KG
): MealResult {
  const totals = computeFoodTotals(food, quantity);
  const workouts = calculateAllWorkouts(totals.calories, weightKg);
  const translations = pickComparisons(totals.calories, 4);
  const fact = pickFact(food, workouts, totals.calories);

  return {
    food,
    quantity,
    totalCalories: totals.calories,
    totalProtein: totals.protein,
    totalCarbs: totals.carbs,
    totalFat: totals.fat,
    workouts,
    fact,
    translations,
  };
}
