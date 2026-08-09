"use client";

import { CravingPlate } from "./CravingPlate";
import { PhotoCredit } from "@/components/Illustrations/PhotoCredit";
import { useAppStore } from "@/store/useAppStore";

export function TonightsSpecials() {
  const selectedFood = useAppStore((s) => s.selectedFood);

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <p className="font-script text-2xl text-gold-soft">Tonight&apos;s Specials</p>
      <CravingPlate food={selectedFood} />
      <PhotoCredit food={selectedFood} />
    </div>
  );
}
