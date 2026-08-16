"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Search, X, RefreshCw, Share2, Printer, UtensilsCrossed, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Food } from "@/types/food";
import { MealResult, WorkoutResult } from "@/types/result";
import { searchFoods, getFoodById } from "@/lib/search";
import { buildMealResult } from "@/lib/calculations";
import { DEFAULT_WEIGHT_KG } from "@/lib/config";
import { useToastStore } from "@/store/useToastStore";
import { Toaster } from "@/components/Common/Toaster";
import { MealReceiptPaper } from "@/components/ReceiptPOC/MealReceiptPaper";
import { MACHINE_WIDTH } from "@/components/ReceiptPOC/constants";

type Stage = "flat" | "standing" | "open";
type FlowState = "menu" | "pos";
type Phase = "idle" | "anticipating" | "printing" | "done";

const EASE = [0.16, 1, 0.3, 1] as const;
const ANTICIPATE_DURATION = 800;
const PRINT_SINGLE_DURATION = 1800;
const PAPER_HEIGHT = 430;
const LANDING_OFFSET_Y = 32;
const BUTTONS_HEIGHT = 180;
const STAGE_GAP = 24;
const STAGE_HEIGHT = PAPER_HEIGHT + LANDING_OFFSET_Y + STAGE_GAP + BUTTONS_HEIGHT;

const BOOK_VARIANTS = {
  flat: { rotateX: 80, y: 90 },
  standing: { rotateX: 0, y: 0 },
  open: { rotateX: 0, y: 0 },
};

function randomOrderNo() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function FoodSelectionPage({ onOrderAndPay }: { onOrderAndPay: (food: Food, qty: number) => void }) {
  const [query, setQuery] = useState("");
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const results = useMemo(() => (query.trim() ? searchFoods(query, 5) : []), [query]);
  const addedFoods = useMemo(
    () => addedIds.map((id) => getFoodById(id)).filter((f): f is Food => Boolean(f)),
    [addedIds]
  );
  const totalCalories = useMemo(
    () => addedFoods.reduce((sum, f) => sum + f.calories, 0),
    [addedFoods]
  );

  function addFood(food: Food) {
    setAddedIds((ids) => (ids.includes(food.id) ? ids : [...ids, food.id]));
    setSelectedId(food.id);
    setQuery("");
  }

  function removeFood(id: string) {
    setAddedIds((ids) => ids.filter((f) => f !== id));
    setSelectedId((current) => (current === id ? null : current));
  }

  function handleOrderAndPay() {
    if (addedFoods.length === 0) return;
    const primaryFood = addedFoods[addedFoods.length - 1];
    onOrderAndPay(primaryFood, addedFoods.length);
  }

  return (
    <div className="absolute right-0 top-0 flex h-full w-1/2 flex-col rounded-sm bg-[#f6ead6] shadow-2xl">
      <div className="px-4 pt-5 text-center sm:px-6 sm:pt-6">
        <h2 className="font-display text-[15px] font-bold tracking-tight text-ink sm:text-lg">
          Le Gourmet
        </h2>
      </div>

      {/* search field */}
      <div className="relative mt-3 px-3 sm:px-4">
        <div className="flex items-center gap-1.5 rounded-sm bg-ink/5 px-2.5 py-1.5">
          <Search size={11} className="shrink-0 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes..."
            className="w-full bg-transparent text-[9px] text-ink placeholder:text-ink/35 focus:outline-none sm:text-[10.5px]"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={11} className="text-ink/40" />
            </button>
          )}
        </div>

        {query.trim() && (
          <div className="absolute inset-x-3 top-[calc(100%+4px)] z-10 overflow-hidden rounded-sm bg-[#fffaf0] shadow-2xl sm:inset-x-4">
            {results.length > 0 ? (
              results.map((food) => (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => addFood(food)}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left hover:bg-ink/5"
                >
                  <span className="text-[12px] leading-none">{food.emoji}</span>
                  <span className="flex-1 truncate text-[9px] text-ink/85 sm:text-[10px]">
                    {food.name}
                  </span>
                  <span className="whitespace-nowrap text-[7.5px] text-ink/45 sm:text-[9px]">
                    {food.calories} kcal
                  </span>
                </button>
              ))
            ) : (
              <p className="px-2 py-2 text-center text-[8px] italic text-ink/40">
                No dishes found.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-3 sm:px-4">
        {addedFoods.length > 0 ? (
          <div className="flex flex-col gap-1">
            {addedFoods.map((food) => {
              const isSelected = food.id === selectedId;
              return (
                <div
                  key={food.id}
                  className={`group flex items-center gap-1 rounded-sm transition-colors ${
                    isSelected ? "bg-gold/20" : "hover:bg-ink/5"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(food.id)}
                    className="flex flex-1 items-center gap-2 px-2 py-1.5 text-left"
                  >
                    <span className="text-[13px] leading-none sm:text-base">{food.emoji}</span>
                    <span className="flex-1 truncate text-[9px] leading-snug text-ink/85 sm:text-[10.5px]">
                      {food.name}
                    </span>
                    <span className="whitespace-nowrap text-[8px] leading-snug text-ink/50 sm:text-[9.5px]">
                      {food.calories} kcal
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFood(food.id)}
                    aria-label={`Remove ${food.name}`}
                    className="shrink-0 pr-2 text-ink/30 hover:text-accent"
                  >
                    <X size={11} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-center text-[8px] italic text-ink/35 sm:text-[9.5px]">
            Search and add dishes to build your list.
          </p>
        )}
      </div>

      {/* running total + order action */}
      <div className="shrink-0 px-4 py-3 sm:px-5 sm:py-4">
        {addedFoods.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-ink/50 sm:text-[9.5px]">
                Total ({addedFoods.length} {addedFoods.length === 1 ? "dish" : "dishes"})
              </span>
              <span className="font-display text-[15px] font-bold text-ink sm:text-lg">
                {totalCalories}{" "}
                <span className="text-[9px] font-normal text-ink/50 sm:text-[11px]">kcal</span>
              </span>
            </div>
            <button
              type="button"
              onClick={handleOrderAndPay}
              className="mt-2 w-full rounded-sm bg-accent py-2 text-[9px] font-semibold uppercase tracking-wide text-white shadow-soft transition-shadow hover:shadow-card sm:text-[10.5px]"
            >
              Order &amp; Pay Bill
            </button>
          </>
        ) : (
          <p className="text-center text-[8px] italic text-ink/40 sm:text-[9.5px]">
            Add dishes to see the total.
          </p>
        )}
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [stage, setStage] = useState<Stage>("flat");
  const [flowState, setFlowState] = useState<FlowState>("menu");

  const [orderedFood, setOrderedFood] = useState<Food | null>(null);
  const [orderedQty, setOrderedQty] = useState<number>(1);

  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<MealResult | null>(null);
  const [receiptMeta, setReceiptMeta] = useState({ orderNo: "0001", timestamp: "" });

  const [dispensedCount, setDispensedCount] = useState<number>(0);
  const [activeStackIndex, setActiveStackIndex] = useState<number>(0);

  const open = stage === "open";

  const activityWorkouts: WorkoutResult[] = useMemo(() => {
    if (!result || !result.workouts) return [];
    return result.workouts.slice(0, 3);
  }, [result]);

  function startPrintingFlow(food: Food, qty: number) {
    setOrderedFood(food);
    setOrderedQty(qty);
    setFlowState("pos");

    const meal = buildMealResult(food, qty, DEFAULT_WEIGHT_KG);
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

  function resetToMenu() {
    setFlowState("menu");
    setStage("flat");
    setPhase("idle");
    setResult(null);
    setOrderedFood(null);
    setOrderedQty(1);
    setDispensedCount(0);
    setActiveStackIndex(0);
  }

  const printed = phase === "printing" || phase === "done";
  const isPrinting = phase === "printing" || phase === "anticipating";

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#1A130E] flex flex-col items-center justify-center">
      <Toaster />
      <Image
        src="/images/backgrounds/fine-dining.png"
        alt="Le Gourmet Fine Dining"
        fill
        priority
        className="object-cover opacity-60 scale-105 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A130E]/60 via-[#1C110F]/80 to-[#120B09] pointer-events-none" />

      {/* Floating Warm Gold Bokeh Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-amber-700/15 blur-[120px] pointer-events-none" />

      {flowState === "menu" ? (
        <>
          {/* 3D Menu Stage */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1400px" }}
          >
            <motion.div
              initial={false}
              animate={BOOK_VARIANTS[stage]}
              transition={{ duration: 1.1, ease: EASE }}
              className="relative w-[240px] sm:w-[300px] md:w-[360px] aspect-[360/504]"
              style={{ transformStyle: "preserve-3d", transformOrigin: "bottom center" }}
            >
              <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
                <motion.div
                  initial={false}
                  animate={{ x: "-50%", opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className={`absolute left-0 top-0 h-full w-[480px] sm:w-[600px] md:w-[720px] ${
                    open ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                >
                  <FoodSelectionPage onOrderAndPay={startPrintingFlow} />
                </motion.div>

                <motion.div
                  initial={{ rotateY: 0, z: 0 }}
                  animate={{ rotateY: open ? -360 : 0, z: open ? -30 : 0 }}
                  transition={{ duration: 1.4, ease: EASE }}
                  className="absolute left-0 top-0 h-full w-full"
                  style={{ transformStyle: "preserve-3d", transformOrigin: "left center" }}
                >
                  {/* front face */}
                  <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                    <Image
                      src="/images/backgrounds/menu-closed.png"
                      alt="Le Gourmet menu"
                      fill
                      priority
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>

                  {/* back face (inside of the front cover) */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-sm bg-[#f6ead6] text-ink/35 shadow-2xl"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/5">
                      <ImageIcon size={20} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-medium tracking-wide">Inside Cover</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="absolute inset-x-0 bottom-6 flex justify-center gap-4 z-20">
            {stage === "flat" && (
              <button
                type="button"
                onClick={() => setStage("standing")}
                className="rounded-btn bg-accent px-8 py-4 text-[17px] font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              >
                Bring Me The Menu
              </button>
            )}

            {stage === "standing" && (
              <button
                type="button"
                onClick={() => setStage("open")}
                className="rounded-btn bg-accent px-8 py-4 text-[17px] font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              >
                Open Menu
              </button>
            )}

            {stage === "open" && (
              <button
                type="button"
                onClick={() => setStage("standing")}
                className="rounded-btn bg-accent px-8 py-4 text-[17px] font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              >
                Close Menu
              </button>
            )}
          </div>
        </>
      ) : (
        /* ── Seamless POS Terminal & Receipt Printing View ── */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] flex flex-col items-center z-10 relative px-4 py-8"
        >
          {/* Header */}
          <div className="mb-6 text-center z-10 relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 text-gold-soft text-xs font-mono font-semibold tracking-widest uppercase px-4 py-1 mb-2 border border-gold/30 backdrop-blur-md">
              <UtensilsCrossed size={12} className="text-gold" />
              LE GOURMET BISTRO POS
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F6EAD6] tracking-tight drop-shadow-lg">
              Bill Paid • Printing Workout Debt
            </h1>
            <p className="text-gold-soft/70 text-xs sm:text-sm mt-1.5 font-sans max-w-md">
              Your order for {orderedFood?.emoji} {orderedFood?.name} ({orderedQty}x) has been billed. Workout receipts dispensing below!
            </p>
          </div>

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
                {phase === "anticipating" && "WARMING PRINTER..."}
                {phase === "printing" && "PRINTING RECEIPT..."}
                {phase === "done" && "RECEIPTS DISPENSED"}
              </span>
            </div>

            {/* Interactive Screen Status */}
            <div className="w-full py-2 px-3 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-between gap-2 my-0.5">
              <div className="flex items-center gap-2 truncate">
                <span className="text-lg shrink-0">{orderedFood?.emoji}</span>
                <div className="text-left truncate">
                  <p className="text-[11px] font-bold text-[#F6EAD6] font-display leading-tight truncate">
                    {orderedFood?.name} ({orderedQty}x)
                  </p>
                  <p className="text-[9.5px] font-mono text-emerald-400 leading-tight">
                    {phase === "done" ? "✓ 3 Receipts Printed Below" : "Processing Workout Receipts..."}
                  </p>
                </div>
              </div>
              {phase === "done" && (
                <button
                  onClick={resetToMenu}
                  className="px-2.5 py-1 rounded-lg bg-accent text-white text-[10px] font-sans font-bold border border-gold/40 shadow transition-all flex items-center gap-1 shrink-0 hover:bg-accent/90"
                >
                  <RefreshCw size={11} />
                  ORDER ANOTHER MEAL
                </button>
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
                onClick={resetToMenu}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-gold-soft/60 hover:text-gold-soft transition-colors"
              >
                <RefreshCw size={13} />
                Order Another Meal in Menu
              </button>
            </motion.div>

          </div>
        </motion.div>
      )}
    </main>
  );
}
