"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { Food } from "@/types/food";
import { searchFoods, getFoodById } from "@/lib/search";
import { useToastStore } from "@/store/useToastStore";
import { Toaster } from "@/components/Common/Toaster";

type Stage = "flat" | "standing" | "open";

const EASE = [0.16, 1, 0.3, 1] as const;

const BOOK_VARIANTS = {
  flat: { rotateX: 80, y: 90 },
  standing: { rotateX: 0, y: 0 },
  open: { rotateX: 0, y: 0 },
};

function PagePlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute right-0 top-0 flex h-full w-1/2 flex-col items-center justify-center gap-2 rounded-sm bg-[#f6ead6] text-ink/35 shadow-2xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/5">
        <ImageIcon size={20} strokeWidth={1.5} />
      </div>
      <span className="text-xs font-medium tracking-wide">{label}</span>
    </div>
  );
}

function FoodSelectionPage() {
  const [query, setQuery] = useState("");
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pushToast = useToastStore((s) => s.push);

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

  function orderAndPay() {
    if (addedFoods.length === 0) return;
    pushToast(`Order placed — ${totalCalories} kcal billed. Bon appétit!`);
    setAddedIds([]);
    setSelectedId(null);
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

      {/* running total + order action, pinned to the bottom of the page */}
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
              onClick={orderAndPay}
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
  const open = stage === "open";

  return (
    <main className="relative h-[100vh] w-full overflow-hidden">
      <Toaster />
      <Image
        src="/images/backgrounds/fine-dining.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

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
              className={`absolute left-0 top-0 h-full w-[480px] sm:w-[600px] md:w-[720px] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
            >
              <FoodSelectionPage />
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

      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-4">
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
          <>
            <button
              type="button"
              onClick={() => setStage("flat")}
              className="rounded-btn bg-accent px-8 py-4 text-[17px] font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={() => setStage("open")}
              className="rounded-btn bg-accent px-8 py-4 text-[17px] font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            >
              Open Menu
            </button>
          </>
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
    </main>
  );
}
