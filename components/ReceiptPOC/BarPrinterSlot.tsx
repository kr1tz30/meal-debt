"use client";

import { motion } from "framer-motion";
import { Printer, Sparkles } from "lucide-react";
import { MACHINE_WIDTH } from "./constants";

interface BarPrinterSlotProps {
  phase: "idle" | "anticipating" | "printing" | "done";
  onTap: () => void;
  disabled?: boolean;
}

export function BarPrinterSlot({ phase, onTap, disabled }: BarPrinterSlotProps) {
  const isPrinting = phase === "printing" || phase === "anticipating";

  return (
    <div className="flex flex-col items-center z-30 relative w-full">
      {/* Sleek metallic Bar Printer fixture bezel */}
      <div className="w-[300px] h-[54px] rounded-2xl bg-gradient-to-b from-[#FAFDFB] via-[#EAEAEA] to-[#D8D8DC] p-2 border border-white/90 shadow-[0_8px_20px_rgba(0,0,0,0.12),inset_0_1.5px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.06)] flex items-center justify-center relative">
        
        {/* Subtle metallic screws on left/right edges */}
        <div className="absolute left-3 w-2 h-2 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border border-gray-400/50 shadow-inner" />
        <div className="absolute right-3 w-2 h-2 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border border-gray-400/50 shadow-inner" />

        {/* Inner dark aperture slit where paper ejects */}
        <div
          style={{ width: MACHINE_WIDTH }}
          className="h-7 rounded-lg bg-[#18181A] shadow-[inset_0_3px_7px_rgba(0,0,0,0.85)] border border-black/40 relative flex items-center justify-between px-3"
        >
          {/* Internal slot depth glow while active */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{
              boxShadow: isPrinting
                ? "inset 0 0 12px rgba(59,130,246,0.5)"
                : "none",
            }}
            transition={{ duration: 0.5 }}
          />

          <span className="font-mono text-[9px] text-gray-500 tracking-widest uppercase select-none z-10">
            {phase === "idle" && "READY"}
            {phase === "anticipating" && "WARMING..."}
            {phase === "printing" && "PRINTING"}
            {phase === "done" && "PRINTED"}
          </span>

          {/* Status LED indicator */}
          <motion.div
            className="w-1.5 h-1.5 rounded-full z-10"
            animate={{
              backgroundColor: isPrinting
                ? "#3B82F6"
                : phase === "done"
                ? "#10B981"
                : disabled
                ? "#9CA3AF"
                : "#10B981",
              boxShadow: isPrinting
                ? "0 0 8px #3B82F6"
                : phase === "done"
                ? "0 0 6px #10B981"
                : "none",
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
