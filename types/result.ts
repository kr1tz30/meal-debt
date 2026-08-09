import { Food } from "./food";
import { Activity } from "./activity";

export interface WorkoutResult {
  activity: Activity;
  minutes: number;
  distanceKm?: number;
  floors?: number;
  caloriesBurned: number;
}

export interface MealResult {
  food: Food;
  quantity: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  workouts: WorkoutResult[];
  fact: string;
  translations: string[];
}
