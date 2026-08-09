"use client";

import { motion } from "framer-motion";
import { Check, Hand } from "lucide-react";

interface ReceiptMachineProps {
  tapped: boolean;
  onTap: () => void;
  disabled?: boolean;
}

export function ReceiptMachine({ tapped, onTap, disabled }: ReceiptMachineProps) {
  return (
    <div className="relative w-[260px]">
      <svg viewBox="0 0 260 300" className="w-full h-auto drop-shadow-lift" aria-hidden>
        <rect x="8" y="8" width="244" height="284" rx="28" fill="#FFFBF2" stroke="#C9972E" strokeWidth="3" />
        <circle cx="30" cy="32" r="5" fill="#4C7A3F" />
        <text x="230" y="36" textAnchor="end" fontSize="11" fill="#B9A588" fontFamily="var(--font-playfair), serif">
          MEAL DEBT
        </text>
        <rect x="40" y="56" width="180" height="16" rx="8" fill="#2C1B10" />
        <rect x="40" y="56" width="180" height="6" rx="3" fill="#4A3222" />
      </svg>

      {/* button */}
      <button
        type="button"
        onClick={onTap}
        disabled={disabled}
        aria-label="Tap to create receipt"
        className="absolute left-1/2 -translate-x-1/2 disabled:pointer-events-none"
        style={{ top: "38%" }}
      >
        <motion.div
          whileHover={disabled ? undefined : { scale: 1.04 }}
          whileTap={disabled ? undefined : { scale: 0.94 }}
          animate={{ scale: tapped ? [1, 0.9, 1] : 1 }}
          transition={{ duration: 0.3 }}
          className="w-24 h-24 rounded-full bg-accent border-4 border-gold shadow-card grid place-items-center"
        >
          {tapped ? (
            <Check size={34} className="text-white" />
          ) : (
            <Hand size={30} className="text-white" />
          )}
        </motion.div>
      </button>

      <p className="absolute left-1/2 -translate-x-1/2 text-center text-[13px] font-bold tracking-[0.14em] text-accent whitespace-nowrap"
         style={{ top: "76%" }}>
        {tapped ? "PRINTING..." : "TAP TO CREATE"}
      </p>
    </div>
  );
}
