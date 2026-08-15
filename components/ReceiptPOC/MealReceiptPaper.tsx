import { MealResult, WorkoutResult } from "@/types/result";
import { formatCalories, formatQuantityLabel, formatWorkoutMetrics } from "@/lib/formatting";
import { MACHINE_WIDTH } from "./constants";

function ZigzagEdge({ flip = false }: { flip?: boolean }) {
  const numTeeth = 40;
  const toothWidth = 400 / numTeeth;
  let points = "";
  for (let i = 0; i < numTeeth; i++) {
    const x1 = i * toothWidth;
    const x2 = x1 + toothWidth / 2;
    const x3 = (i + 1) * toothWidth;
    points += `${x1},4 ${x2},0 ${x3},4 `;
  }
  points += "400,4 0,4";

  return (
    <svg
      viewBox="0 0 400 4"
      preserveAspectRatio="none"
      className={`block w-full h-[4px] ${flip ? "rotate-180" : ""}`}
    >
      <polygon points={points} fill="#FAF9F6" />
    </svg>
  );
}

function DashedLine() {
  return <div className="border-t border-dashed border-ink/20 my-2" />;
}

function Row({ left, right, bold }: { left: string; right: string; bold?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-2 text-[11px] ${bold ? "font-bold text-ink" : "text-ink/80"}`}>
      <span className="truncate">{left}</span>
      <span className="whitespace-nowrap tabular-nums">{right}</span>
    </div>
  );
}

interface MealReceiptPaperProps {
  result: MealResult;
  orderNo: string;
  timestamp: string;
  activeWorkout?: WorkoutResult;
  badgeLabel?: string;
}

export function MealReceiptPaper({ result, orderNo, timestamp, activeWorkout, badgeLabel }: MealReceiptPaperProps) {
  const isDedicatedActivity = !!activeWorkout;
  const metrics = activeWorkout ? formatWorkoutMetrics(activeWorkout) : null;

  return (
    <div style={{ width: MACHINE_WIDTH }} className="font-mono text-ink select-none relative">
      {/* Top micro-teeth tear edge */}
      <ZigzagEdge />

      <div className="bg-[#FAF9F6] px-4 pt-3.5 pb-6 shadow-[0_14px_36px_rgba(0,0,0,0.16)] relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center">
          <p className="font-display font-black text-sm tracking-wider text-ink uppercase">
            {isDedicatedActivity ? `${activeWorkout.activity.name} DEBT` : "COMING UP NEXT"}
          </p>
          <p className="text-[9.5px] text-ink/50 tracking-tight mt-0.5">
            {isDedicatedActivity ? "EQUIVALENT WORKOUT DEBT" : "MEAL DEBT COUNTER"}
          </p>
        </div>

        <DashedLine />

        {/* Date & Order info */}
        <Row left="Date." right={timestamp} />
        <Row left={`Order #${orderNo}`} right={isDedicatedActivity ? activeWorkout.activity.name.toUpperCase() : "HINT."} bold />

        {/* Main Graphic Box */}
        {isDedicatedActivity && metrics ? (
          <div className="my-3 py-3 px-3 rounded-lg bg-ink/[0.04] border border-ink/15 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 text-2xl filter drop-shadow-sm">
              <span>{result.food.emoji}</span>
              <span className="text-sm font-bold text-ink/40">➔</span>
              <span>{activeWorkout.activity.emoji}</span>
            </div>
            
            <div className="text-center mt-1">
              <p className="text-[10px] text-ink/50 font-semibold uppercase tracking-wider">
                TO BURN {formatCalories(result.totalCalories)} KCAL
              </p>
              <p className="font-display font-black text-lg text-ink tracking-tight mt-0.5">
                {metrics.headline}
              </p>
              {metrics.subline && (
                <p className="text-[10px] text-ink/70 font-mono mt-0.5">
                  ({metrics.subline})
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="my-3 py-3 px-2 rounded-lg bg-ink/[0.03] border border-ink/10 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
            <div className="text-3xl filter drop-shadow-sm">
              {result.food.emoji}
            </div>
            <span className="font-bold text-[12px] tracking-wide text-ink uppercase">
              {result.food.name}
            </span>
            <span className="text-[10px] text-ink/60 font-mono">
              {result.quantity}x • {formatCalories(result.totalCalories)} kcal
            </span>
          </div>
        )}

        <DashedLine />

        {/* Detail Rows */}
        {isDedicatedActivity ? (
          <div className="space-y-1">
            <Row left="Item Consumed" right={formatQuantityLabel(result.food.name, result.quantity)} />
            <Row left="Calorie Debt" right={`${formatCalories(result.totalCalories)} kcal`} bold />
            <Row left="Activity" right={activeWorkout.activity.name} />
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold tracking-wider text-ink/90 uppercase mb-1">
              WORKOUT TO BURN:
            </p>
            <div className="space-y-1">
              {result.workouts.slice(0, 3).map((w) => {
                const { headline } = formatWorkoutMetrics(w);
                return (
                  <Row key={w.activity.id} left={`${w.activity.emoji} ${w.activity.name}`} right={headline} />
                );
              })}
            </div>
          </>
        )}

        <DashedLine />

        <Row left="TOTAL DEBT" right={`${formatCalories(result.totalCalories)} kcal`} bold />

        <DashedLine />

        {/* Barcode & Footer Branding */}
        <div className="mt-3 flex flex-col items-center justify-center gap-1">
          <div className="flex items-end justify-center gap-[2px] h-6 opacity-85">
            {Array.from({ length: 28 }, (_, i) => (
              <div
                key={i}
                className="bg-ink"
                style={{ width: (i * 7) % 3 === 0 ? 2.5 : 1.2, height: (i % 5 === 0 ? 20 : 14) + (i % 3) * 2 }}
              />
            ))}
          </div>
          <span className="text-[9px] text-ink/50 tracking-widest uppercase mt-0.5">
            ONLY IN MEALDEBT
          </span>
        </div>

        {/* Sticker Badge */}
        <div className="absolute bottom-2 right-2 rotate-[-12deg] bg-ink text-[#FAF9F6] text-[8px] font-bold tracking-wider px-2 py-0.5 rounded-full shadow-md border border-white/20">
          {badgeLabel || (isDedicatedActivity ? activeWorkout.activity.name.toUpperCase() : "MEAL DEBT ★")}
        </div>
      </div>

      {/* Bottom micro-teeth tear edge */}
      <ZigzagEdge flip />
    </div>
  );
}
