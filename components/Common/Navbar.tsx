"use client";

import Link from "next/link";
import { Github, Moon, Sun, Tv, UtensilsCrossed } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/store/useAppStore";
import { ChefMouseIcon } from "@/components/Story/BistroSign";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const reset = useAppStore((s) => s.reset);
  const phase = useAppStore((s) => s.phase);

  const onDark = phase === "idle";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2x md:px-4x py-2x">
      <div className="mx-auto max-w-content flex items-center justify-between">
        <button
          onClick={reset}
          className={`flex items-center gap-2 font-display text-[17px] font-bold tracking-tight transition-colors ${
            onDark ? "text-card" : "text-ink dark:text-ink-dark"
          }`}
          aria-label="Meal Debt home"
        >
          <ChefMouseIcon className={`w-6 h-6 ${onDark ? "text-gold" : "text-accent"}`} />
          <span>Meal Debt</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            href="/tv"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00FF66] bg-black/80 border border-[#00FF66]/40 px-3 py-1.5 rounded-full hover:bg-black transition-all shadow-md"
          >
            <Tv size={14} />
            CRT TV EXPERIENCE
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-gold-soft bg-gold/15 border border-gold/40 px-3 py-1.5 rounded-full hover:bg-gold/25 transition-all shadow-md"
          >
            <UtensilsCrossed size={14} />
            3D MENU
          </Link>
          {phase !== "idle" && (
            <button
              onClick={reset}
              className="hidden sm:inline-flex text-sm font-medium text-muted hover:text-ink dark:hover:text-ink-dark px-3 py-2 rounded-btn transition-colors"
            >
              New Search
            </button>
          )}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="View on GitHub"
            className={`p-2 rounded-btn transition-colors ${
              onDark
                ? "text-card/70 hover:text-card hover:bg-white/10"
                : "text-muted hover:text-ink dark:hover:text-ink-dark hover:bg-ink/[0.04]"
            }`}
          >
            <Github size={18} />
          </a>
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className={`p-2 rounded-btn transition-colors ${
              onDark
                ? "text-card/70 hover:text-card hover:bg-white/10"
                : "text-muted hover:text-ink dark:hover:text-ink-dark hover:bg-ink/[0.04]"
            }`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
