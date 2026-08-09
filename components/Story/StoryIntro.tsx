"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, SkipForward } from "lucide-react";
import { ParisRooftopScene } from "./ParisRooftopScene";
import { BistroSign } from "./BistroSign";
import { KitchenInterior } from "./KitchenInterior";
import { MascotTruffle } from "./MascotTruffle";

type Stage = "rooftop" | "sign" | "kitchen" | "greet";

const GREETING = "Hey! What are you craving tonight?";

interface StoryIntroProps {
  onComplete: () => void;
}

export function StoryIntro({ onComplete }: StoryIntroProps) {
  const [stage, setStage] = useState<Stage>("rooftop");
  const [typed, setTyped] = useState("");
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (stage !== "rooftop") return;
    const t = setTimeout(() => setStage("sign"), 2200);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "sign") return;
    const t = setTimeout(() => setStage("kitchen"), 2400);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "kitchen") return;
    const t = setTimeout(() => setStage("greet"), 900);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "greet") return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTyped(GREETING.slice(0, i));
      if (i >= GREETING.length) {
        clearInterval(interval);
        setTimeout(() => setShowContinue(true), 300);
      }
    }, 32);
    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className="fixed inset-0 z-[200] bg-black">
      <button
        onClick={onComplete}
        className="absolute top-5 right-5 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/30 text-white/80 hover:text-white hover:bg-black/45 backdrop-blur-sm px-4 py-2 text-xs font-medium tracking-wide transition-colors"
      >
        Skip Story
        <SkipForward size={13} />
      </button>

      <AnimatePresence mode="wait">
        {stage === "rooftop" && (
          <motion.div
            key="rooftop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="absolute inset-0"
          >
            <ParisRooftopScene className="w-full h-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-6 text-center">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="font-display italic text-lg md:text-2xl text-white/90 max-w-md"
              >
                Somewhere above the rooftops of Paris,
                <br />a little bistro is about to open.
              </motion.p>
            </div>
          </motion.div>
        )}

        {stage === "sign" && (
          <motion.div
            key="sign"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="absolute inset-0"
          >
            <ParisRooftopScene className="w-full h-full scale-110 blur-[2px] brightness-[0.65]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
              >
                <BistroSign size="lg" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {(stage === "kitchen" || stage === "greet") && (
          <motion.div
            key="kitchen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <KitchenInterior className="w-full h-full">
              <div className="relative w-full h-full flex flex-col items-center justify-end pb-0">
                <AnimatePresence>
                  {stage === "greet" && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                      className="mb-4 max-w-xs rounded-2xl rounded-bl-sm bg-card px-5 py-3.5 shadow-lift"
                    >
                      <p className="text-ink font-medium text-[15px] min-h-[1.5em]">
                        {typed}
                        <span className="inline-block w-[2px] h-[1em] bg-ink/40 ml-0.5 align-middle animate-pulse" />
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ y: 140 }}
                  animate={{ y: stage === "greet" ? 0 : 140 }}
                  transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.2 }}
                >
                  <MascotTruffle size={190} waving />
                </motion.div>

                <AnimatePresence>
                  {showContinue && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      onClick={onComplete}
                      className="mb-10 mt-4 inline-flex items-center gap-2 rounded-btn bg-accent px-7 py-3.5 text-[15px] font-semibold text-white shadow-card hover:shadow-lift transition-shadow"
                    >
                      Let&apos;s See The Menu
                      <ArrowRight size={17} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </KitchenInterior>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
