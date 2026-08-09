import { forwardRef } from "react";
import { MealResult } from "@/types/result";
import { formatCalories, formatWorkoutMetrics } from "@/lib/formatting";

interface ShareCardProps {
  result: MealResult;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { result },
  ref
) {
  const topWorkouts = result.workouts.slice(0, 3);

  return (
    <div
      ref={ref}
      className="w-[420px] rounded-[28px] bg-card p-9 flex flex-col gap-6 border border-ink/[0.06]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <span className="text-6xl leading-none">{result.food.emoji}</span>
        <h2 className="text-2xl font-bold text-ink">
          {result.quantity > 1 ? `${result.quantity} x ${result.food.name}` : result.food.name}
        </h2>
        <p className="text-ink/50 text-sm font-medium">
          ≈ {formatCalories(result.totalCalories)} Calories
        </p>
      </div>

      <div className="h-px bg-ink/[0.08]" />

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/40 text-center">
          To burn this
        </p>
        {topWorkouts.map((w) => {
          const { headline } = formatWorkoutMetrics(w);
          return (
            <div
              key={w.activity.id}
              className="flex items-center justify-between rounded-2xl bg-ink/[0.03] px-4 py-3"
            >
              <span className="flex items-center gap-2 text-ink font-medium text-sm">
                <span className="text-xl">{w.activity.emoji}</span>
                {w.activity.name}
              </span>
              <span className="font-bold text-ink text-sm tabular-nums">{headline}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1.5 pt-1">
        <span className="text-lg">🍕</span>
        <span className="font-bold text-ink tracking-tight">Meal Debt</span>
      </div>
    </div>
  );
});
