import { Food } from "@/types/food";
import { getPhotoCreditKey } from "./photoRegistry";
import credits from "@/data/imageCredits.json";

type Credits = Record<string, { author: string; license: string; source: string }>;
const CREDITS = credits as Credits;

export function PhotoCredit({ food }: { food: Food | null }) {
  if (!food) return null;
  const key = getPhotoCreditKey(food.id);
  if (!key) return null;
  const credit = CREDITS[key];
  if (!credit) return null;

  return (
    <a
      href={credit.source}
      target="_blank"
      rel="noreferrer"
      className="text-[11px] text-card/40 hover:text-card/70 transition-colors"
    >
      Photo: {credit.author} · {credit.license}
    </a>
  );
}
