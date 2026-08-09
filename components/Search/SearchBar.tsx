"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Food } from "@/types/food";
import { searchFoods, getFoodsByIds, getTrendingFoods } from "@/lib/search";
import { SearchSuggestions } from "./SearchSuggestions";
import { useAppStore } from "@/store/useAppStore";

interface SearchBarProps {
  autoFocus?: boolean;
}

export function SearchBar({ autoFocus }: SearchBarProps) {
  const selectedFood = useAppStore((s) => s.selectedFood);
  const selectFood = useAppStore((s) => s.selectFood);
  const recentSearches = useAppStore((s) => s.recentSearches);

  const [query, setQuery] = useState(selectedFood?.name ?? "");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(selectedFood?.name ?? "");
  }, [selectedFood]);

  const results = useMemo<Food[]>(() => {
    if (query.trim().length === 0) {
      const recent = getFoodsByIds(recentSearches).slice(0, 4);
      const trending = getTrendingFoods(6).filter((f) => !recent.includes(f));
      return [...recent, ...trending].slice(0, 8);
    }
    return searchFoods(query, 8);
  }, [query, recentSearches]);

  const showRecentLabel = query.trim().length === 0 && recentSearches.length > 0;

  useEffect(() => {
    setHighlighted(0);
  }, [results]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSelect(food: Food) {
    selectFood(food);
    setQuery(food.name);
    setOpen(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[highlighted];
      if (pick) handleSelect(pick);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex items-center gap-3 bg-card dark:bg-card-dark rounded-search border-2 transition-shadow ${
          open ? "shadow-lift border-gold" : "shadow-soft border-gold/40"
        }`}
      >
        <Search className="ml-5 shrink-0 text-copper" size={22} strokeWidth={2} />
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tonight's craving..."
          role="combobox"
          aria-expanded={open}
          aria-controls="search-suggestions"
          autoComplete="off"
          className="w-full bg-transparent py-5 pr-2 text-[17px] md:text-[19px] placeholder:text-muted/70 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="mr-5 shrink-0 text-muted hover:text-ink dark:hover:text-ink-dark transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="search-suggestions"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[420px] overflow-y-auto rounded-card bg-card dark:bg-card-dark shadow-lift border border-ink/[0.06] dark:border-white/[0.08]"
          >
            {results.length > 0 ? (
              <SearchSuggestions
                foods={results}
                highlightedIndex={highlighted}
                onHover={setHighlighted}
                onSelect={handleSelect}
                label={showRecentLabel ? "Recent & Trending" : query.trim() ? undefined : "Trending Today"}
              />
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="font-medium">We couldn&apos;t find that meal.</p>
                <p className="text-sm text-muted mt-1">
                  Try another dish or explore trending foods.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
