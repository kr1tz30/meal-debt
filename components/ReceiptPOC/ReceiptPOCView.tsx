"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, Share2, Minus, Plus, Printer, Store, Sparkles } from "lucide-react";
import { Food } from "@/types/food";
import { MealResult, WorkoutResult } from "@/types/result";
import { searchFoods, getTrendingFoods } from "@/lib/search";
import { buildMealResult } from "@/lib/calculations";
import { clampQuantity } from "@/lib/validation";
import { DEFAULT_WEIGHT_KG } from "@/lib/config";
import { MealReceiptPaper } from "./MealReceiptPaper";
import { MACHINE_WIDTH } from "./constants";

type Phase = "idle" | "anticipating" | "printing" | "done";

const ANTICIPATE_DURATION = 800;
const PRINT_SINGLE_DURATION = 1800;
const PAPER_HEIGHT = 430;
const LANDING_OFFSET_Y = 32;
const BUTTONS_HEIGHT = 180;
const STAGE_GAP = 24;
const STAGE_HEIGHT = PAPER_HEIGHT + LANDING_OFFSET_Y + STAGE_GAP + BUTTONS_HEIGHT;
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

  const [dispensedCount, setDispensedCount] = useState<number>(0);
  const [activeStackIndex, setActiveStackIndex] = useState<number>(0);

  const suggestions = useMemo(() => {
    if (!query.trim()) return getTrendingFoods(SUGGESTIONS_COUNT);
    return searchFoods(query, SUGGESTIONS_COUNT);
  }, [query]);

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
      setDispensedCount(1);

      setTimeout(() => {
        setDispensedCount(2);
      }, PRINT_SINGLE_DURATION + 300);

      setTimeout(() => {
        setDispensedCount(3);
      }, (PRINT_SINGLE_DURATION + 300) * 2);

      setTimeout(() => {
        setPhase("done");
        setActiveStackIndex(2);
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
  const isPrinting = phase === "printing" || phase === "anticipating";

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-8 bg-[#120D0A]">
      
      {/* ── Dim Bistro Background Image & Warm Ambient Bokeh Overlay ── */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 pointer-events-none"
        style={{ backgroundImage: "url('/bistro_bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#120D0A]/70 via-[#160E0A]/85 to-[#0F0805] pointer-events-none" />

      {/* Floating Warm Bokeh Glow Orbs */}
      <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-amber-600/15 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-yellow-600/10 blur-[110px] pointer-events-none" />

      {/* Page Header */}
      <div className="mb-6 text-center z-10 relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono font-semibold tracking-wider px-3.5 py-1 mb-2 border border-amber-500/20 backdrop-blur-md">
          <Store size={13} className="text-amber-400" />
          BISTRO POS COUNTER
        </span>
        <h1 className="font-display text-3xl font-black text-amber-50 tracking-tight drop-shadow-md">
          Meal Debt Bistro Terminal
        </h1>
        <p className="text-amber-200/60 text-xs mt-1 font-mono">
          Select your dish on the POS screen to print workout receipts onto the counter.
        </p>
      </div>

      {/* ── Professional Bistro POS Terminal Device Container ── */}
      <div className="w-full max-w-[440px] flex flex-col items-center z-10 relative">
        
        {/* 1. Tilted Touch Screen Menu Display */}
        <div className="w-full rounded-2xl bg-[#1C1714] border-4 border-[#332A25] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.5)] p-4 flex flex-col relative overflow-hidden backdrop-blur-md">
          
          {/* Screen Top Header Bar */}
          <div className="flex items-center justify-between border-b border-amber-500/15 pb-2.5 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              <span className="text-[11px] font-mono font-bold text-amber-200/90 tracking-wider uppercase">
                BISTRO POS • TABLE 04
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-400/60 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {phase === "idle" && "READY TO ORDER"}
              {phase === "anticipating" && "WARMING PRINTER..."}
              {phase === "printing" && "PRINTING DEBT..."}
              {phase === "done" && "RECEIPTS DISPENSED"}
            </span>
          </div>

          {/* Interactive Menu Screen Content — compact, zero wasted vertical space */}
          <div className="w-full flex flex-col items-center justify-center transition-all duration-300">
            {picking ? (
              <div className="w-full flex flex-col items-center">
                {!selectedFood ? (
                  <div className="w-full">
                    <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-[#261F1B] px-3.5 py-2 shadow-inner">
                      <Search size={15} className="text-amber-400/60 shrink-0" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search a dish or menu item..."
                        className="w-full bg-transparent focus:outline-none text-xs text-amber-100 placeholder:text-amber-200/40 font-medium"
                      />
                    </div>
                    <div className="mt-1.5 rounded-xl border border-amber-500/15 bg-[#221B17] shadow-lg overflow-hidden">
                      {suggestions.slice(0, 3).map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFood(f)}
                          style={{ height: 38 }}
                          className="w-full flex items-center gap-2.5 px-3 text-left hover:bg-amber-500/10 transition-colors border-b border-amber-500/10 last:border-0"
                        >
                          <span className="text-base">{f.emoji}</span>
                          <span className="text-xs font-semibold text-amber-100">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 w-full py-1">
                    <button
                      onClick={() => setSelectedFood(null)}
                      className="flex items-center gap-2 rounded-full bg-amber-500/15 border border-amber-500/30 px-3.5 py-1 shadow-sm text-xs font-semibold text-amber-200 hover:bg-amber-500/25 transition-all"
                    >
                      <span className="text-base">{selectedFood.emoji}</span>
                      {selectedFood.name}
                      <span className="text-amber-400/50 text-[10px]">(change)</span>
                    </button>

                    <div className="flex items-center gap-2 bg-[#261F1B] rounded-xl border border-amber-500/20 shadow-inner px-2 py-1">
                      <button
                        onClick={() => setQuantity((q) => clampQuantity(q - 1))}
                        className="w-7 h-7 grid place-items-center rounded-lg hover:bg-amber-500/20 text-amber-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-xs tabular-nums text-amber-100">
                        {quantity}x
                      </span>
                      <button
                        onClick={() => setQuantity((q) => clampQuantity(q + 1))}
                        className="w-7 h-7 grid place-items-center rounded-lg hover:bg-amber-500/20 text-amber-200 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      onClick={handleTap}
                      className="w-full mt-0.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-amber-950 font-mono font-black text-xs tracking-wider py-2.5 shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase"
                    >
                      <Printer size={15} />
                      PRINT WORKOUT RECEIPT
                    </button>
                  </div>
                )}
              </div>
            ) : phase === "done" ? (
              <div className="w-full py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2 my-0.5">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-lg shrink-0">{selectedFood?.emoji}</span>
                  <div className="text-left truncate">
                    <p className="text-[11px] font-bold text-amber-100 font-mono leading-tight truncate">
                      {selectedFood?.name} ({quantity}x)
                    </p>
                    <p className="text-[9.5px] font-mono text-emerald-400 leading-tight">
                      ✓ 3 Receipts Printed Below
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] font-mono font-bold border border-amber-500/30 transition-all flex items-center gap-1 shrink-0"
                >
                  <RefreshCw size={11} />
                  NEW ORDER
                </button>
              </div>
            ) : (
              <div className="py-3 flex items-center justify-center gap-2 text-center">
                <Sparkles size={16} className="text-amber-400 animate-spin" />
                <p className="font-mono text-xs font-bold text-amber-200 tracking-wider uppercase">
                  {phase === "anticipating" ? "Warming Up Thermal Printer..." : "Printing Receipts..."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. POS Terminal Base & Thermal Printer Slot Fixture */}
        <div className="w-[360px] bg-gradient-to-b from-[#28211D] via-[#1D1714] to-[#140F0C] border-x-2 border-b-2 border-[#3D322C] rounded-b-2xl shadow-2xl relative flex flex-col items-center justify-between p-3 z-30">
          
          {/* Keypad & LED Status Bar */}
          <div className="w-full flex items-center justify-between px-3 py-1 border-b border-amber-500/10 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/30" />
            </div>
            <span className="font-mono text-[9px] text-amber-200/40 tracking-widest uppercase">
              THERMAL PRINTER v2.4
            </span>
            <div
              className={`w-2 h-2 rounded-full transition-all ${
                isPrinting
                  ? "bg-amber-400 shadow-[0_0_10px_#F59E0B] animate-ping"
                  : phase === "done"
                  ? "bg-emerald-400 shadow-[0_0_8px_#10B981]"
                  : "bg-amber-500/40"
              }`}
            />
          </div>

          {/* Built-in Dark Aperture Printer Slot Slit */}
          <div
            style={{ width: MACHINE_WIDTH }}
            className="h-6 rounded-lg bg-[#0F0A08] shadow-[inset_0_3px_8px_rgba(0,0,0,0.9)] border border-black/60 relative flex items-center justify-between px-3 overflow-hidden"
          >
            <span className="font-mono text-[8.5px] text-amber-200/30 tracking-widest uppercase select-none">
              SLOT #1 • DISPENSER
            </span>
          </div>
        </div>

        {/* ── 3. Paper Dispenser Stage (Ejects Receipts onto Wooden Counter Table) ── */}
        <div
          className="relative w-full flex flex-col items-center mt-[-22px] z-20"
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
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all shadow-md ${
                        isActive
                          ? "bg-amber-400 text-amber-950 shadow-amber-500/20 scale-105"
                          : "bg-[#28211D]/90 text-amber-200/80 hover:bg-[#332A25] border border-amber-500/20 backdrop-blur-md"
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
            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-2.5 text-xs font-mono font-bold text-amber-950 shadow-lg hover:brightness-110 transition-all">
              <Share2 size={14} />
              SHARE RECEIPT STACK
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-200/60 hover:text-amber-200 transition-colors"
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
