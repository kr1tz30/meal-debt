"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Download, Link2, Share2 } from "lucide-react";
import { MealResult } from "@/types/result";
import { ShareCard } from "./ShareCard";
import { useShareCard } from "@/hooks/useShareCard";
import { copyToClipboard } from "@/utils/helpers";
import { useToastStore } from "@/store/useToastStore";
import { Button } from "@/components/Common/Button";

interface ShareSectionProps {
  result: MealResult;
}

export function ShareSection({ result }: ShareSectionProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { download, share } = useShareCard(cardRef, `${result.food.id}-meal-debt.png`);
  const pushToast = useToastStore((s) => s.push);

  async function handleDownload() {
    const ok = await download();
    if (ok) pushToast("Downloaded!");
  }

  async function handleCopyLink() {
    const ok = await copyToClipboard(typeof window !== "undefined" ? window.location.href : "");
    if (ok) pushToast("Copied!");
  }

  async function handleShare() {
    const shared = await share();
    if (shared) {
      pushToast("Shared!");
    } else {
      const ok = await copyToClipboard(typeof window !== "undefined" ? window.location.href : "");
      if (ok) pushToast("Link copied instead!");
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <h3 className="text-xl md:text-2xl font-bold">Show Your Friends.</h3>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="scale-[0.72] sm:scale-90 md:scale-100 origin-top shadow-lift rounded-[28px]"
      >
        <ShareCard ref={cardRef} result={result} />
      </motion.div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={handleDownload} variant="secondary" icon={<Download size={17} />} iconPosition="left">
          Download Image
        </Button>
        <Button onClick={handleCopyLink} variant="secondary" icon={<Link2 size={17} />} iconPosition="left">
          Copy Link
        </Button>
        <Button onClick={handleShare} variant="primary" icon={<Share2 size={17} />} iconPosition="left">
          Share
        </Button>
      </div>
    </div>
  );
}
