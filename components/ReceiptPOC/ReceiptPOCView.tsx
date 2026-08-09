"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Share2, Minus, Plus } from "lucide-react";
import { Food } from "@/types/food";
import { MealResult } from "@/types/result";
import { searchFoods, getTrendingFoods } from "@/lib/search";
import { buildMealResult } from "@/lib/calculations";
import { clampQuantity } from "@/lib/validation";
import { DEFAULT_WEIGHT_KG } from "@/lib/config";
import { ReceiptMachine } from "./ReceiptMachine";
import { MealReceiptPaper } from "./MealReceiptPaper";
import { MACHINE_WIDTH } from "./constants";

type Phase = "idle" | "anticipating" | "printing" | "done";

const ANTICIPATE_DURATION = 900;
const PRINT_DURATION = 3000;
const PAPER_HEIGHT = 400;
const BUTTONS_HEIGHT = 150;
const STAGE_GAP = 28;
const STAGE_HEIGHT = PAPER_HEIGHT + STAGE_GAP + BUTTONS_HEIGHT;
const PICKER_HEIGHT = 300;
const SUGGESTIONS_COUNT = 5;
const ROW_HEIGHT = 44;

// Paper feeds out in bursts, like a real thermal printer's stepper motor —
// a quick rise, a blurred pause while it "settles", then the next burst.
const FEED_TIMES = [0, 0.05, 0.22, 0.27, 0.44, 0.49, 0.66, 0.71, 0.88, 0.93, 1];
const FEED_HEIGHT_FRACTIONS = [0, 0.2, 0.2, 0.42, 0.42, 0.62, 0.62, 0.82, 0.82, 1, 1];
const FEED_BLUR_PX = [0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0];
const FEED_HEIGHTS = FEED_HEIGHT_FRACTIONS.map((f) => f * PAPER_HEIGHT);
const FEED_FILTERS = FEED_BLUR_PX.map((b) => `blur(${b}px)`);

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

  const suggestions = useMemo(() => {
    if (!query.trim()) return getTrendingFoods(SUGGESTIONS_COUNT);
    return searchFoods(query, SUGGESTIONS_COUNT);
  }, [query]);

  function handleTap() {
    if (!selectedFood || phase !== "idle") return;
    const meal = buildMealResult(selectedFood, quantity, DEFAULT_WEIGHT_KG);
    setResult(meal);
    setReceiptMeta({
      orderNo: randomOrderNo(),
      timestamp: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    setPhase("anticipating");
    setTimeout(() => setPhase("printing"), ANTICIPATE_DURATION);
    setTimeout(() => setPhase("done"), ANTICIPATE_DURATION + PRINT_DURATION);
  }

  function reset() {
    setPhase("idle");
    setResult(null);
    setSelectedFood(null);
    setQuery("");
    setQuantity(1);
  }

  const picking = phase === "idle";
  const printed = phase === "printing" || phase === "done";

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center px-6 py-16">
      <div className="mb-10 text-center">
        <span className="inline-block rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide px-3 py-1 mb-3">
          PROTOTYPE
        </span>
        <h1 className="font-display text-3xl font-bold text-ink">Receipt Printer</h1>
        <p className="text-muted text-sm mt-1">Print out exactly what tonight&apos;s meal costs.</p>
      </div>

      {/* picker — fixed-height stage, content is centered within it so nothing below ever shifts */}
      <div
        style={{ height: PICKER_HEIGHT }}
        className="w-full max-w-sm flex flex-col items-center justify-center mb-6"
      >
        <motion.div
          animate={{ opacity: picking ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className={`w-full ${picking ? "" : "pointer-events-none"}`}
        >
          {!selectedFood ? (
            <div className="w-full">
              <div className="flex items-center gap-2 rounded-btn border-2 border-gold/40 bg-card px-4 py-3 shadow-soft">
                <Search size={18} className="text-copper shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a dish..."
                  className="w-full bg-transparent focus:outline-none text-[15px]"
                />
              </div>
              <div
                style={{ height: SUGGESTIONS_COUNT * ROW_HEIGHT }}
                className="mt-2 rounded-card border border-gold/20 bg-card shadow-soft overflow-hidden"
              >
                {suggestions.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFood(f)}
                    style={{ height: ROW_HEIGHT }}
                    className="w-full flex items-center gap-3 px-4 text-left hover:bg-ink/[0.04] transition-colors"
                  >
                    <span className="text-xl">{f.emoji}</span>
                    <span className="text-sm font-medium">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setSelectedFood(null)}
                className="flex items-center gap-2 rounded-full bg-card border border-gold/30 px-4 py-2 shadow-soft text-sm font-medium"
              >
                <span className="text-lg">{selectedFood.emoji}</span>
                {selectedFood.name}
                <span className="text-muted text-xs">(change)</span>
              </button>

              <div className="flex items-center gap-1 bg-card rounded-qty border-2 border-gold/40 shadow-soft p-1.5">
                <button
                  onClick={() => setQuantity((q) => clampQuantity(q - 1))}
                  className="w-9 h-9 grid place-items-center rounded-[12px] hover:bg-ink/[0.05]"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-bold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => clampQuantity(q + 1))}
                  className="w-9 h-9 grid place-items-center rounded-[12px] hover:bg-ink/[0.05]"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* machine — fixed anchor, never moves */}
      <ReceiptMachine phase={phase} onTap={handleTap} disabled={!selectedFood} />

      {/* stage below machine — fixed height reserved from the start, paper + buttons positioned absolutely inside it */}
      <div className="relative" style={{ width: MACHINE_WIDTH, height: STAGE_HEIGHT }}>
        <motion.div
          className="absolute top-0 left-0 overflow-hidden pointer-events-none"
          style={{ width: MACHINE_WIDTH }}
          animate={
            phase === "printing"
              ? { height: FEED_HEIGHTS, filter: FEED_FILTERS }
              : phase === "done"
              ? { height: PAPER_HEIGHT, filter: "blur(0px)" }
              : { height: 0, filter: "blur(0px)" }
          }
          transition={
            phase === "printing"
              ? { duration: PRINT_DURATION / 1000, times: FEED_TIMES, ease: "easeOut" }
              : { duration: 0.3 }
          }
        >
          {result && (
            <div className="pointer-events-auto">
              <MealReceiptPaper result={result} orderNo={receiptMeta.orderNo} timestamp={receiptMeta.timestamp} />
            </div>
          )}
        </motion.div>

        <motion.div
          animate={{ opacity: phase === "done" ? 1 : 0, y: phase === "done" ? 0 : 10 }}
          transition={{ delay: phase === "done" ? 0.5 : 0, duration: 0.5 }}
          style={{ top: PAPER_HEIGHT + STAGE_GAP }}
          className={`absolute left-0 right-0 flex flex-col items-center gap-3 ${
            phase === "done" ? "" : "pointer-events-none"
          }`}
        >
          <button className="inline-flex items-center gap-2 rounded-btn bg-accent border-2 border-gold px-7 py-3.5 text-[15px] font-semibold text-white shadow-card hover:shadow-lift transition-shadow">
            <Share2 size={17} />
            Share Receipt
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors"
          >
            <RefreshCw size={13} />
            Print Another
          </button>
        </motion.div>
      </div>
    </div>
  );
}
