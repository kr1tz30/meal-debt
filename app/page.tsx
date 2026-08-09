"use client";

import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Common/Navbar";
import { Toaster } from "@/components/Common/Toaster";
import { Hero } from "@/components/Hero/Hero";
import { RevealAnimation } from "@/components/Reveal/RevealAnimation";
import { Results } from "@/components/Results/Results";
import { StoryIntro } from "@/components/Story/StoryIntro";
import { useAppStore } from "@/store/useAppStore";
import { useIntroSeen } from "@/hooks/useIntroSeen";

export default function Home() {
  const phase = useAppStore((s) => s.phase);
  const result = useAppStore((s) => s.result);
  const { seen, ready, markSeen } = useIntroSeen();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Toaster />
      <AnimatePresence mode="wait">
        {phase === "idle" && <Hero key="hero" />}
        {phase === "revealing" && <RevealAnimation key="reveal" />}
        {phase === "result" && result && <Results key="results" result={result} />}
      </AnimatePresence>
      {ready && !seen && phase === "idle" && <StoryIntro onComplete={markSeen} />}
    </main>
  );
}
