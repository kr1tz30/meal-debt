import { Food } from "@/types/food";

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function computeFoodTotals(food: Food, quantity: number): MacroTotals {
  const q = Math.max(quantity, 0);
  return {
    calories: Math.round(food.calories * q),
    protein: Math.round(food.protein * q),
    carbs: Math.round(food.carbs * q),
    fat: Math.round(food.fat * q),
  };
}
