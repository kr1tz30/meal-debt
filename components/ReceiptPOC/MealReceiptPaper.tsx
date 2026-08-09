import { MealResult } from "@/types/result";
import { formatCalories, formatQuantityLabel, formatWorkoutMetrics } from "@/lib/formatting";
import { MACHINE_WIDTH } from "./constants";

function ZigzagEdge({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 10"
      preserveAspectRatio="none"
      className={`block w-full h-[10px] ${flip ? "rotate-180" : ""}`}
    >
      <polygon
        points="0,0 10,10 20,0 30,10 40,0 50,10 60,0 70,10 80,0 90,10 100,0 110,10 120,0 130,10 140,0 150,10 160,0 170,10 180,0 190,10 200,0 200,0 0,0"
        fill="#FFFDF7"
      />
    </svg>
  );
}

function DashedLine() {
  return <div className="border-t-2 border-dashed border-ink/25 my-2" />;
}

function Row({ left, right, bold }: { left: string; right: string; bold?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-2 text-[11.5px] ${bold ? "font-bold" : ""}`}>
      <span className="truncate">{left}</span>
      <span className="whitespace-nowrap tabular-nums">{right}</span>
    </div>
  );
}

interface MealReceiptPaperProps {
  result: MealResult;
  orderNo: string;
  timestamp: string;
}

export function MealReceiptPaper({ result, orderNo, timestamp }: MealReceiptPaperProps) {
  return (
    <div style={{ width: MACHINE_WIDTH }} className="font-mono text-ink select-none">
      <ZigzagEdge />
      <div className="bg-[#FFFDF7] px-5 py-4 shadow-lift">
        <div className="text-center">
          <p className="font-display font-bold text-base tracking-wide">MEAL DEBT</p>
          <p className="text-[10px] text-ink/60">Every Bite Has A Price</p>
        </div>

        <DashedLine />

        <Row left={`#${orderNo}`} right={timestamp} />

        <DashedLine />

        <Row left={formatQuantityLabel(result.food.name, result.quantity)} right="" />
        <Row left="  Energy" right={`${formatCalories(result.totalCalories)} kcal`} />

        <DashedLine />

        <p className="text-[10.5px] font-bold tracking-[0.1em] mb-1.5">TO BURN THIS OFF:</p>
        {result.workouts.slice(0, 3).map((w) => {
          const { headline } = formatWorkoutMetrics(w);
          return (
            <Row key={w.activity.id} left={`  ${w.activity.emoji} ${w.activity.name}`} right={headline} />
          );
        })}

        <DashedLine />

        <Row left="TOTAL DEBT" right={`${formatCalories(result.totalCalories)} kcal`} bold />

        <DashedLine />

        <p className="text-center text-[11px] font-semibold">Thank you, come again!</p>

        <div className="mt-3 flex items-end justify-center gap-[2px] h-5">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="bg-ink"
              style={{ width: (i * 7) % 3 === 0 ? 2.5 : 1.2, height: (i % 5 === 0 ? 16 : 11) + (i % 3) * 2 }}
            />
          ))}
        </div>
      </div>
      <ZigzagEdge flip />
    </div>
  );
}
