"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, RefreshCw, Share2, Minus, Plus } from "lucide-react";
import { Food } from "@/types/food";
import { MealResult } from "@/types/result";
import { searchFoods, getTrendingFoods } from "@/lib/search";
import { buildMealResult } from "@/lib/calculations";
import { clampQuantity } from "@/lib/validation";
import { DEFAULT_WEIGHT_KG } from "@/lib/config";
import { ReceiptMachine } from "./ReceiptMachine";
import { MealReceiptPaper } from "./MealReceiptPaper";

type Phase = "idle" | "printing" | "ejected";

const PRINT_DURATION = 1600;

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
    if (!query.trim()) return getTrendingFoods(5);
    return searchFoods(query, 6);
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
    setPhase("printing");
    setTimeout(() => setPhase("ejected"), PRINT_DURATION);
  }

  function reset() {
    setPhase("idle");
    setResult(null);
    setSelectedFood(null);
    setQuery("");
    setQuantity(1);
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center px-6 py-16">
      <div className="mb-10 text-center">
        <span className="inline-block rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide px-3 py-1 mb-3">
          PROTOTYPE
        </span>
        <h1 className="font-display text-3xl font-bold text-ink">Receipt Printer</h1>
        <p className="text-muted text-sm mt-1">Print out exactly what tonight&apos;s meal costs.</p>
      </div>

      <AnimatePresence mode="wait">
        {phase !== "ejected" ? (
          <motion.div
            key="setup"
            exit={{ opacity: 0 }}
            className="w-full max-w-sm flex flex-col items-center gap-8"
          >
            {!selectedFood && (
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
                <div className="mt-2 rounded-card border border-gold/20 bg-card shadow-soft overflow-hidden">
                  {suggestions.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFood(f)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-ink/[0.04] transition-colors"
                    >
                      <span className="text-xl">{f.emoji}</span>
                      <span className="text-sm font-medium">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedFood && (
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

            <div className="relative flex flex-col items-center">
              <ReceiptMachine tapped={phase === "printing"} onTap={handleTap} disabled={!selectedFood} />

              <motion.div
                className="overflow-hidden -mt-2"
                animate={{ height: phase === "printing" ? 540 : 0 }}
                transition={{ duration: PRINT_DURATION / 1000, ease: "easeOut" }}
              >
                {result && (
                  <MealReceiptPaper result={result} orderNo={receiptMeta.orderNo} timestamp={receiptMeta.timestamp} />
                )}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ejected"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="flex flex-col items-center gap-8"
          >
            {result && (
              <MealReceiptPaper result={result} orderNo={receiptMeta.orderNo} timestamp={receiptMeta.timestamp} />
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-3"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
