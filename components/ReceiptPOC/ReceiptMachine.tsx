"use client";

import { motion } from "framer-motion";
import { Hand, Check } from "lucide-react";
import { MACHINE_WIDTH } from "./constants";

interface ReceiptMachineProps {
  phase: "idle" | "anticipating" | "printing" | "done";
  onTap: () => void;
  disabled?: boolean;
}

const KEYPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

export function ReceiptMachine({ phase, onTap, disabled }: ReceiptMachineProps) {
  const tapped = phase !== "idle";

  return (
    <div
      style={{ width: MACHINE_WIDTH }}
      className="rounded-t-[26px] border-2 border-ink bg-card shadow-[6px_6px_0_0_rgba(44,27,16,0.9)] px-5 pt-0 pb-0 flex flex-col items-center"
    >
      {/* vent (decorative) */}
      <div className="w-[80px] h-2 rounded-b-md bg-ink/40 mt-0" />

      <p className="font-mono text-[10px] tracking-[0.2em] text-muted mt-3 mb-3">MEAL DEBT PRINTER</p>

      {/* screen / tap area */}
      <button
        type="button"
        onClick={onTap}
        disabled={disabled}
        aria-label="Tap to create receipt"
        className="w-full disabled:opacity-40 disabled:pointer-events-none"
      >
        <motion.div
          whileHover={disabled ? undefined : { y: -1 }}
          whileTap={disabled ? undefined : { y: 1 }}
          animate={phase === "anticipating" ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={{ duration: 0.6, repeat: phase === "anticipating" ? Infinity : 0 }}
          className="w-full h-32 rounded-2xl bg-[#CDEEDD] border-2 border-ink flex flex-col items-center justify-center gap-2"
        >
          {tapped ? (
            <Check size={30} className="text-ink" strokeWidth={2.5} />
          ) : (
            <Hand size={28} className="text-ink" strokeWidth={2} />
          )}
          <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-ink">
            {phase === "idle" && "TAP TO CREATE"}
            {phase === "anticipating" && "WARMING UP..."}
            {(phase === "printing" || phase === "done") && "PRINTING..."}
          </span>
        </motion.div>
      </button>

      {/* decorative keypad */}
      <div className="grid grid-cols-3 gap-2 mt-5 w-full">
        {KEYPAD_ROWS.flat().map((k) => (
          <div
            key={k}
            className="h-8 rounded-lg border-2 border-ink/70 bg-[#F5F1E6] grid place-items-center font-mono text-[11px] text-ink/50"
          >
            {k}
          </div>
        ))}
      </div>

      {/* paper exit slot — warms up while printing */}
      <motion.div
        className="h-4 mt-3 -mx-5"
        style={{ width: "calc(100% + 40px)" }}
        animate={{
          backgroundColor:
            phase === "anticipating" || phase === "printing" ? "#3b1f0e" : "#1c1210",
          boxShadow:
            phase === "anticipating"
              ? [
                  "0 -4px 0px rgba(255,170,60,0)",
                  "0 -4px 14px rgba(255,170,60,0.55)",
                  "0 -4px 0px rgba(255,170,60,0)",
                ]
              : phase === "printing"
              ? "0 -4px 10px rgba(255,170,60,0.28)"
              : "none",
        }}
        transition={{
          duration: phase === "anticipating" ? 0.65 : 0.4,
          repeat: phase === "anticipating" ? Infinity : 0,
          repeatType: "loop",
        }}
      />
    </div>
  );
}
