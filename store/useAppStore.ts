import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Food } from "@/types/food";
import { MealResult } from "@/types/result";
import { buildMealResult } from "@/lib/calculations";
import { clampQuantity, clampWeightKg } from "@/lib/validation";
import { DEFAULT_WEIGHT_KG, RECENT_SEARCHES_LIMIT } from "@/lib/config";

export type Phase = "idle" | "revealing" | "result";

interface AppState {
  selectedFood: Food | null;
  quantity: number;
  weightKg: number;
  useCustomWeight: boolean;
  phase: Phase;
  result: MealResult | null;
  recentSearches: string[];

  selectFood: (food: Food) => void;
  setQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  setWeight: (weightKg: number) => void;
  setUseCustomWeight: (value: boolean) => void;
  reveal: () => void;
  startReveal: () => void;
  finishReveal: () => void;
  reset: () => void;
  addRecentSearch: (foodId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedFood: null,
      quantity: 1,
      weightKg: DEFAULT_WEIGHT_KG,
      useCustomWeight: false,
      phase: "idle",
      result: null,
      recentSearches: [],

      selectFood: (food) => {
        set({ selectedFood: food, quantity: 1 });
        get().addRecentSearch(food.id);
      },

      setQuantity: (quantity) => set({ quantity: clampQuantity(quantity) }),

      incrementQuantity: () =>
        set((s) => ({ quantity: clampQuantity(s.quantity + 1) })),

      decrementQuantity: () =>
        set((s) => ({ quantity: clampQuantity(s.quantity - 1) })),

      setWeight: (weightKg) => {
        const clamped = clampWeightKg(weightKg);
        set({ weightKg: clamped });
        const { selectedFood, quantity, phase } = get();
        if (phase === "result" && selectedFood) {
          set({ result: buildMealResult(selectedFood, quantity, clamped) });
        }
      },

      setUseCustomWeight: (value) =>
        set({ useCustomWeight: value, weightKg: value ? get().weightKg : DEFAULT_WEIGHT_KG }),

      startReveal: () => set({ phase: "revealing" }),

      finishReveal: () => {
        const { selectedFood, quantity, weightKg } = get();
        if (!selectedFood) return;
        const result = buildMealResult(selectedFood, quantity, weightKg);
        set({ result, phase: "result" });
      },

      reveal: () => {
        const { selectedFood, quantity, weightKg } = get();
        if (!selectedFood) return;
        const result = buildMealResult(selectedFood, quantity, weightKg);
        set({ result, phase: "result" });
      },

      reset: () => set({ phase: "idle", result: null, selectedFood: null, quantity: 1 }),

      addRecentSearch: (foodId) =>
        set((s) => ({
          recentSearches: [
            foodId,
            ...s.recentSearches.filter((id) => id !== foodId),
          ].slice(0, RECENT_SEARCHES_LIMIT),
        })),
    }),
    {
      name: "meal-debt:store",
      partialize: (s) => ({
        recentSearches: s.recentSearches,
        weightKg: s.weightKg,
        useCustomWeight: s.useCustomWeight,
      }),
    }
  )
);
