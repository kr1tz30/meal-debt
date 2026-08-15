"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, Share2, Minus, Plus, Printer } from "lucide-react";
import { Food } from "@/types/food";
import { MealResult, WorkoutResult } from "@/types/result";
import { searchFoods, getTrendingFoods } from "@/lib/search";
import { buildMealResult } from "@/lib/calculations";
import { clampQuantity } from "@/lib/validation";
import { DEFAULT_WEIGHT_KG } from "@/lib/config";
import { BarPrinterSlot } from "./BarPrinterSlot";
import { MealReceiptPaper } from "./MealReceiptPaper";
import { MACHINE_WIDTH } from "./constants";

type Phase = "idle" | "anticipating" | "printing" | "done";

const ANTICIPATE_DURATION = 800;
const PRINT_SINGLE_DURATION = 1800; // time for one receipt to slide out of the slot
const PAPER_HEIGHT = 430;
const LANDING_OFFSET_Y = 32; // Extra breathing room down from the slot bar
const BUTTONS_HEIGHT = 180;
const STAGE_GAP = 24;
const STAGE_HEIGHT = PAPER_HEIGHT + LANDING_OFFSET_Y + STAGE_GAP + BUTTONS_HEIGHT;
const PICKER_HEIGHT = 280;
const SUGGESTIONS_COUNT = 4;
const ROW_HEIGHT = 42;

function randomOrderNo() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function ReceiptPOCView() {
  const [query, setQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<MealResult | null>(null);
  const [receiptMeta, setReceiptMeta] = useState({ orderNo: "0001", timestamp: "" });

  // Tracks how many receipts have started dispensing (1, 2, or 3)
  const [dispensedCount, setDispensedCount] = useState<number>(0);
  // Tracks active card index selected in the interactive stack when done
  const [activeStackIndex, setActiveStackIndex] = useState<number>(0);

  const suggestions = useMemo(() => {
    if (!query.trim()) return getTrendingFoods(SUGGESTIONS_COUNT);
    return searchFoods(query, SUGGESTIONS_COUNT);
  }, [query]);

  // Array of 3 activity workout results (Running, Walking, Cycling)
  const activityWorkouts: WorkoutResult[] = useMemo(() => {
    if (!result || !result.workouts) return [];
    return result.workouts.slice(0, 3);
  }, [result]);

  function handleTap() {
    if (!selectedFood || phase !== "idle") return;
    const meal = buildMealResult(selectedFood, quantity, DEFAULT_WEIGHT_KG);
    setResult(meal);
    setReceiptMeta({
      orderNo: randomOrderNo(),
      timestamp: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).replace(/\//g, "."),
    });

    setPhase("anticipating");
    setDispensedCount(0);
    setActiveStackIndex(0);

    setTimeout(() => {
      setPhase("printing");
      setDispensedCount(1); // Start Receipt 1

      setTimeout(() => {
        setDispensedCount(2); // Start Receipt 2
      }, PRINT_SINGLE_DURATION + 300);

      setTimeout(() => {
        setDispensedCount(3); // Start Receipt 3
      }, (PRINT_SINGLE_DURATION + 300) * 2);

      setTimeout(() => {
        setPhase("done");
        setActiveStackIndex(2); // Set top receipt as active
      }, (PRINT_SINGLE_DURATION + 300) * 3 + 200);
    }, ANTICIPATE_DURATION);
  }

  function reset() {
    setPhase("idle");
    setResult(null);
    setSelectedFood(null);
    setQuery("");
    setQuantity(1);
    setDispensedCount(0);
    setActiveStackIndex(0);
  }

  const picking = phase === "idle";
  const printed = phase === "printing" || phase === "done";

  return (
    <div className="min-h-screen bg-[#D8D8DC] flex flex-col items-center justify-center px-4 py-12">
      
      {/* Page Header */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 text-ink/70 text-xs font-mono font-semibold tracking-wider px-3.5 py-1 mb-2.5 border border-black/10">
          <Printer size={13} />
          BAR PRINTER DISPENSER
        </span>
        <h1 className="font-display text-3xl font-extrabold text-ink tracking-tight">Receipt Dispenser</h1>
        <p className="text-ink/60 text-sm mt-1">Watch receipts print sequentially & drop into the stack.</p>
      </div>

      {/* ── Main Bar Printer Enclosure Card ── */}
      <div className="w-full max-w-[420px] rounded-[36px] bg-gradient-to-b from-[#EEEEF0] via-[#E2E2E5] to-[#D5D5D9] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.18),inset_0_2px_0_rgba(255,255,255,0.9)] border border-white/70 relative flex flex-col items-center">
        
        {/* Top Metallic Slot Bar Fixture */}
        <BarPrinterSlot phase={phase} onTap={handleTap} disabled={!selectedFood} />

        {/* Paper Dispenser Stage — top clipped 100% at slot line, bottom unclipped down to 9999px */}
        <div
          className="relative w-full flex flex-col items-center mt-[-26px] z-20"
          style={{
            height: STAGE_HEIGHT,
            clipPath: "polygon(-100px 0px, 600px 0px, 600px 9999px, -100px 9999px)",
          }}
        >
          
          {/* ── Sequential Dispense & Stack Layer ── */}
          {printed && activityWorkouts.length > 0 && (
            <div className="relative w-full flex items-center justify-center pt-2 overflow-visible" style={{ minHeight: PAPER_HEIGHT + LANDING_OFFSET_Y + 20 }}>
              {activityWorkouts.map((w, idx) => {
                const hasDispensed = idx < dispensedCount;
                if (!hasDispensed) return null;

                const isCurrentlyDispensing = phase === "printing" && idx === dispensedCount - 1;
                const isStackDone = phase === "done";
                const isActiveInStack = isStackDone && activeStackIndex === idx;

                // Base stack positions while dispensing
                const baseRotate = idx === 0 ? -4.5 : idx === 1 ? 4.5 : -1.2;
                const baseX = idx === 0 ? -16 : idx === 1 ? 16 : 0;
                const baseY = LANDING_OFFSET_Y + (2 - idx) * 8;

                let targetX = baseX;
                let targetY = baseY;
                let targetRotate = baseRotate;
                let targetScale = 1;
                let targetZIndex = idx + 10;

                if (isCurrentlyDispensing) {
                  targetX = [ 0, 0, baseX ];
                  targetY = [ -PAPER_HEIGHT, LANDING_OFFSET_Y, baseY ];
                  targetRotate = [ 0, 0, baseRotate ];
                  targetZIndex = 30;
                } else if (isStackDone) {
                  const isActive = activeStackIndex === idx;
                  const offset = idx - activeStackIndex;

                  if (isActive) {
                    targetX = 0;
                    targetY = LANDING_OFFSET_Y;
                    targetRotate = 0;
                    targetScale = 1;
                    targetZIndex = 40;
                  } else {
                    targetX = offset < 0 ? -20 : 20;
                    targetY = LANDING_OFFSET_Y + 12 + Math.abs(offset) * 4;
                    targetRotate = offset < 0 ? -5 : 5;
                    targetScale = 0.94;
                    targetZIndex = 20 - Math.abs(offset);
                  }
                }

                return (
                  <motion.div
                    key={w.activity.id}
                    onClick={() => isStackDone && setActiveStackIndex(idx)}
                    initial={{ x: 0, y: -PAPER_HEIGHT, rotate: 0, scale: 1 }}
                    animate={{
                      x: targetX,
                      y: targetY,
                      rotate: targetRotate,
                      scale: targetScale,
                      zIndex: targetZIndex,
                    }}
                    transition={
                      isCurrentlyDispensing
                        ? {
                            duration: PRINT_SINGLE_DURATION / 1000,
                            times: [0, 0.85, 1],
                            ease: "easeInOut",
                          }
                        : { type: "spring", stiffness: 320, damping: 24 }
                    }
                    className={`absolute top-0 ${isStackDone ? "cursor-pointer hover:shadow-2xl" : ""}`}
                    style={{ width: MACHINE_WIDTH }}
                  >
                    <MealReceiptPaper
                      result={result!}
                      orderNo={receiptMeta.orderNo}
                      timestamp={receiptMeta.timestamp}
                      activeWorkout={w}
                      badgeLabel={`${w.activity.name.toUpperCase()} ★`}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Dish Picker Stage — overlayed when idle */}
          {picking && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: picking ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xs flex flex-col items-center pt-8 z-20"
            >
              {!selectedFood ? (
                <div className="w-full">
                  <div className="flex items-center gap-2.5 rounded-xl border border-black/15 bg-white/80 backdrop-blur-sm px-3.5 py-2.5 shadow-sm">
                    <Search size={16} className="text-ink/40 shrink-0" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search a dish..."
                      className="w-full bg-transparent focus:outline-none text-sm text-ink font-medium placeholder:text-ink/40"
                    />
                  </div>
                  <div className="mt-2 rounded-xl border border-black/10 bg-white/90 backdrop-blur-sm shadow-md overflow-hidden">
                    {suggestions.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFood(f)}
                        style={{ height: ROW_HEIGHT }}
                        className="w-full flex items-center gap-3 px-3.5 text-left hover:bg-black/5 transition-colors border-b border-black/[0.04] last:border-0"
                      >
                        <span className="text-lg">{f.emoji}</span>
                        <span className="text-xs font-semibold text-ink">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                  <button
                    onClick={() => setSelectedFood(null)}
                    className="flex items-center gap-2 rounded-full bg-white/90 border border-black/10 px-4 py-1.5 shadow-sm text-xs font-semibold text-ink"
                  >
                    <span className="text-base">{selectedFood.emoji}</span>
                    {selectedFood.name}
                    <span className="text-ink/40 text-[10px]">(change)</span>
                  </button>

                  <div className="flex items-center gap-1.5 bg-white/90 rounded-2xl border border-black/10 shadow-sm p-1.5">
                    <button
                      onClick={() => setQuantity((q) => clampQuantity(q - 1))}
                      className="w-8 h-8 grid place-items-center rounded-xl hover:bg-black/5 text-ink"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-sm tabular-nums text-ink">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => clampQuantity(q + 1))}
                      className="w-8 h-8 grid place-items-center rounded-xl hover:bg-black/5 text-ink"
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    onClick={handleTap}
                    className="w-full mt-2 rounded-xl bg-ink text-white font-mono font-bold text-xs tracking-wider py-3 shadow-md hover:bg-ink/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Printer size={15} />
                    DISPENSE 3 SEQUENTIAL RECEIPTS
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Multi-Receipt Activity Tabs (Positioned AT THE BOTTOM below receipt stack!) ── */}
          <AnimatePresence>
            {phase === "done" && activityWorkouts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                style={{ top: PAPER_HEIGHT + LANDING_OFFSET_Y + 12 }}
                className="absolute left-0 right-0 flex items-center justify-center gap-1.5 z-40"
              >
                {activityWorkouts.map((w, idx) => {
                  const isActive = activeStackIndex === idx;
                  return (
                    <button
                      key={w.activity.id}
                      onClick={() => setActiveStackIndex(idx)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all shadow-sm ${
                        isActive
                          ? "bg-ink text-white shadow-md scale-105"
                          : "bg-white/90 text-ink/70 hover:bg-white border border-black/10"
                      }`}
                    >
                      <span>{w.activity.emoji}</span>
                      <span>{w.activity.name}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons after done printing */}
          <motion.div
            animate={{ opacity: phase === "done" ? 1 : 0, y: phase === "done" ? 0 : 10 }}
            transition={{ delay: phase === "done" ? 0.4 : 0, duration: 0.4 }}
            style={{ top: PAPER_HEIGHT + LANDING_OFFSET_Y + 58 }}
            className={`absolute left-0 right-0 flex flex-col items-center gap-2.5 ${
              phase === "done" ? "z-40" : "pointer-events-none"
            }`}
          >
            <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-2.5 text-xs font-mono font-bold text-white shadow-md hover:bg-ink/90 transition-all">
              <Share2 size={14} />
              SHARE RECEIPT STACK
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-ink/60 hover:text-ink transition-colors"
            >
              <RefreshCw size={13} />
              Print Another Meal
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
