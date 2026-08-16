"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, Share2, Minus, Plus, Printer, UtensilsCrossed, Sparkles } from "lucide-react";
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
const SUGGESTIONS_COUNT = 3;

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
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-8 bg-[#1A130E]">
      
      {/* ── Shashank's Fine Dining Background Image ── */}
      <Image
        src="/images/backgrounds/fine-dining.png"
        alt="Le Gourmet Fine Dining"
        fill
        priority
        className="object-cover opacity-60 scale-105 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A130E]/60 via-[#1C110F]/80 to-[#120B09] pointer-events-none" />

      {/* Floating Warm Gold Bokeh Glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-amber-700/15 blur-[120px] pointer-events-none" />

      {/* Page Header — Le Gourmet Fine Dining Theme */}
      <div className="mb-6 text-center z-10 relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 text-gold-soft text-xs font-mono font-semibold tracking-widest uppercase px-4 py-1 mb-2 border border-gold/30 backdrop-blur-md">
          <UtensilsCrossed size={12} className="text-gold" />
          LE GOURMET BISTRO POS
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F6EAD6] tracking-tight drop-shadow-lg">
          Le Gourmet Receipt Printer
        </h1>
        <p className="text-gold-soft/70 text-xs sm:text-sm mt-1.5 font-sans max-w-md">
          Select your dish on the POS terminal to dispense fine-dining workout receipts onto the table.
        </p>
      </div>

      {/* ── Fine-Dining Mahogany & Brass POS Terminal Device Container ── */}
      <div className="w-full max-w-[440px] flex flex-col items-center z-10 relative">
        
        {/* 1. Tilted Touch Screen Menu Display */}
        <div className="w-full rounded-2xl bg-gradient-to-b from-[#2B1B18] via-[#211311] to-[#1A0E0C] border-2 border-gold/30 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-4 flex flex-col relative overflow-hidden backdrop-blur-md">
          
          {/* Screen Top Header Bar */}
          <div className="flex items-center justify-between border-b border-gold/20 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(201,151,46,0.8)]" />
              <span className="font-display text-[12px] font-bold text-gold-soft tracking-wider uppercase">
                LE GOURMET • TABLE 04
              </span>
            </div>
            <span className="text-[9.5px] font-mono text-gold-soft/80 bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
              {phase === "idle" && "READY TO ORDER"}
              {phase === "anticipating" && "WARMING PRINTER..."}
              {phase === "printing" && "PRINTING RECEIPT..."}
              {phase === "done" && "RECEIPTS DISPENSED"}
            </span>
          </div>

          {/* Interactive Menu Screen Content */}
          <div className="w-full flex flex-col items-center justify-center transition-all duration-300">
            {picking ? (
              <div className="w-full flex flex-col items-center">
                {!selectedFood ? (
                  <div className="w-full">
                    <div className="flex items-center gap-2.5 rounded-xl border border-gold/25 bg-[#180E0C] px-3.5 py-2 shadow-inner">
                      <Search size={15} className="text-gold/60 shrink-0" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search a fine dining dish..."
                        className="w-full bg-transparent focus:outline-none text-xs text-[#F6EAD6] placeholder:text-gold-soft/40 font-sans"
                      />
                    </div>
                    <div className="mt-1.5 rounded-xl border border-gold/20 bg-[#170E0C] shadow-lg overflow-hidden">
                      {suggestions.slice(0, 3).map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFood(f)}
                          style={{ height: 38 }}
                          className="w-full flex items-center gap-2.5 px-3 text-left hover:bg-gold/15 transition-colors border-b border-gold/10 last:border-0"
                        >
                          <span className="text-base">{f.emoji}</span>
                          <span className="text-xs font-semibold text-[#F6EAD6] flex-1 truncate">{f.name}</span>
                          <span className="text-[10px] text-gold-soft/60 font-mono">{f.calories} kcal</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2.5 w-full py-1">
                    <button
                      onClick={() => setSelectedFood(null)}
                      className="flex items-center gap-2 rounded-full bg-gold/15 border border-gold/30 px-3.5 py-1 shadow-sm text-xs font-semibold text-gold-soft hover:bg-gold/25 transition-all"
                    >
                      <span className="text-base">{selectedFood.emoji}</span>
                      {selectedFood.name}
                      <span className="text-gold-soft/50 text-[10px]">(change)</span>
                    </button>

                    <div className="flex items-center gap-2 bg-[#170E0C] rounded-xl border border-gold/20 shadow-inner px-2.5 py-1">
                      <button
                        onClick={() => setQuantity((q) => clampQuantity(q - 1))}
                        className="w-7 h-7 grid place-items-center rounded-lg hover:bg-gold/20 text-gold-soft transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-xs tabular-nums text-[#F6EAD6]">
                        {quantity}x
                      </span>
                      <button
                        onClick={() => setQuantity((q) => clampQuantity(q + 1))}
                        className="w-7 h-7 grid place-items-center rounded-lg hover:bg-gold/20 text-gold-soft transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      onClick={handleTap}
                      className="w-full mt-0.5 rounded-xl bg-accent text-white font-sans font-bold text-xs tracking-wider py-2.5 shadow-lg border border-gold/40 hover:bg-accent/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase"
                    >
                      <Printer size={15} />
                      PRINT WORKOUT RECEIPT
                    </button>
                  </div>
                )}
              </div>
            ) : phase === "done" ? (
              <div className="w-full py-2 px-3 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-between gap-2 my-0.5">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-lg shrink-0">{selectedFood?.emoji}</span>
                  <div className="text-left truncate">
                    <p className="text-[11px] font-bold text-[#F6EAD6] font-display leading-tight truncate">
                      {selectedFood?.name} ({quantity}x)
                    </p>
                    <p className="text-[9.5px] font-mono text-emerald-400 leading-tight">
                      ✓ 3 Receipts Printed Below
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="px-2.5 py-1 rounded-lg bg-gold/20 hover:bg-gold/30 text-gold-soft text-[10px] font-mono font-bold border border-gold/30 transition-all flex items-center gap-1 shrink-0"
                >
                  <RefreshCw size={11} />
                  NEW ORDER
                </button>
              </div>
            ) : (
              <div className="py-3 flex items-center justify-center gap-2 text-center">
                <Sparkles size={16} className="text-gold animate-spin" />
                <p className="font-mono text-xs font-bold text-gold-soft tracking-wider uppercase">
                  {phase === "anticipating" ? "Warming Up Thermal Printer..." : "Printing Receipts..."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. POS Terminal Base & Thermal Printer Slot Fixture */}
        <div className="w-[360px] bg-gradient-to-b from-[#231513] via-[#1B0F0D] to-[#120807] border-x-2 border-b-2 border-gold/30 rounded-b-2xl shadow-2xl relative flex flex-col items-center justify-between p-3 z-30">
          
          {/* Keypad & LED Status Bar */}
          <div className="w-full flex items-center justify-between px-3 py-1 border-b border-gold/15 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold/30" />
            </div>
            <span className="font-mono text-[9px] text-gold-soft/50 tracking-widest uppercase">
              LE GOURMET DISPENSER
            </span>
            <div
              className={`w-2 h-2 rounded-full transition-all ${
                isPrinting
                  ? "bg-gold shadow-[0_0_10px_#C9972E] animate-ping"
                  : phase === "done"
                  ? "bg-emerald-400 shadow-[0_0_8px_#10B981]"
                  : "bg-gold/40"
              }`}
            />
          </div>

          {/* Built-in Dark Aperture Printer Slot Slit */}
          <div
            style={{ width: MACHINE_WIDTH }}
            className="h-6 rounded-lg bg-[#0A0504] shadow-[inset_0_3px_8px_rgba(0,0,0,0.95)] border border-gold/30 relative flex items-center justify-between px-3 overflow-hidden"
          >
            <span className="font-mono text-[8.5px] text-gold-soft/40 tracking-widest uppercase select-none">
              SLOT #1 • LE GOURMET
            </span>
          </div>
        </div>

        {/* ── 3. Paper Dispenser Stage (Ejects Receipts onto Fine Dining Table) ── */}
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

          {/* ── Multi-Receipt Activity Tabs ── */}
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
                      className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all shadow-md ${
                        isActive
                          ? "bg-accent text-white border border-gold/40 shadow-lg scale-105"
                          : "bg-[#211311]/90 text-gold-soft/80 hover:bg-[#2B1B18] border border-gold/20 backdrop-blur-md"
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
            <button className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs font-sans font-bold text-white shadow-lg border border-gold/40 hover:bg-accent/90 transition-all uppercase tracking-wider">
              <Share2 size={14} />
              SHARE RECEIPT STACK
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-gold-soft/60 hover:text-gold-soft transition-colors"
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
