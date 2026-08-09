"use client";

import { motion } from "framer-motion";

interface BistroSignProps {
  name?: string;
  tagline?: string;
  size?: "md" | "lg";
  swinging?: boolean;
  className?: string;
}

export function BistroSign({
  name = "Meal Debt",
  tagline = "EVERY BITE HAS A PRICE",
  size = "lg",
  swinging = true,
  className = "",
}: BistroSignProps) {
  const scale = size === "lg" ? 1 : 0.72;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* wall bracket */}
      <svg width={40 * scale} height={26 * scale} viewBox="0 0 40 26" className="text-ink dark:text-ink-dark">
        <path
          d="M2,2 Q10,2 10,10 L10,22 M10,10 Q22,4 38,6"
          stroke="currentColor"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="2" cy="2" r="2.5" fill="currentColor" />
        <circle cx="38" cy="6" r="2" fill="currentColor" />
      </svg>

      <motion.div
        className={swinging ? "animate-swing" : ""}
        style={{ transformOrigin: "50% -10px" }}
      >
        {/* chain */}
        <svg width={4} height={18 * scale} className="mx-auto block text-ink dark:text-ink-dark">
          <line x1="2" y1="0" x2="2" y2={18 * scale} stroke="currentColor" strokeWidth="2" />
        </svg>

        <div
          className="relative rounded-[18px] border-[3px] border-gold bg-accent shadow-lift px-7 py-5 text-center"
          style={{ width: 260 * scale }}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gold border-2 border-accent grid place-items-center shadow-soft">
            <ChefMouseIcon className="w-6 h-6 text-accent" />
          </div>

          <p
            className="font-script text-gold-soft leading-none pt-2"
            style={{ fontSize: 40 * scale, color: "#F1DCA0" }}
          >
            {name}
          </p>
          <p
            className="mt-1 text-[10px] tracking-[0.18em] font-semibold text-card"
            style={{ fontSize: 10 * scale + 2 }}
          >
            {tagline}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function ChefMouseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="26" r="13" fill="currentColor" />
      <circle cx="13" cy="16" r="6" fill="currentColor" />
      <circle cx="35" cy="16" r="6" fill="currentColor" />
      <circle cx="13" cy="16" r="2.6" fill="white" fillOpacity={0.5} />
      <circle cx="35" cy="16" r="2.6" fill="white" fillOpacity={0.5} />
      <path
        d="M14,20 Q24,10 34,20 Q34,6 24,4 Q14,6 14,20 Z"
        fill="white"
      />
      <ellipse cx="24" cy="30" rx="6" ry="4.5" fill="white" fillOpacity={0.85} />
      <circle cx="20" cy="25" r="1.6" fill="white" />
      <circle cx="28" cy="25" r="1.6" fill="white" />
      <path d="M22,31 Q24,33 26,31" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
