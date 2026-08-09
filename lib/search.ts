import Fuse, { IFuseOptions } from "fuse.js";
import foodsData from "@/data/foods.json";
import trendingData from "@/data/trending.json";
import { Food } from "@/types/food";
import { pickRandom } from "@/utils/random";

export const FOODS = foodsData as Food[];

const fuseOptions: IFuseOptions<Food> = {
  keys: [
    { name: "name", weight: 0.55 },
    { name: "aliases", weight: 0.3 },
    { name: "category", weight: 0.1 },
    { name: "cuisine", weight: 0.05 },
  ],
  threshold: 0.32,
  distance: 60,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 1,
};

const fuse = new Fuse(FOODS, fuseOptions);

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function searchFoods(query: string, limit = 8): Food[] {
  const q = normalize(query);
  if (!q) return getTrendingFoods(limit);

  const exact = FOODS.filter(
    (f) => normalize(f.name) === q || f.aliases.some((a) => normalize(a) === q)
  );
  const startsWith = FOODS.filter(
    (f) =>
      !exact.includes(f) &&
      (normalize(f.name).startsWith(q) || f.aliases.some((a) => normalize(a).startsWith(q)))
  );

  const fuzzy = fuse
    .search(q)
    .map((r) => r.item)
    .filter((f) => !exact.includes(f) && !startsWith.includes(f));

  const ranked = [...exact, ...startsWith, ...fuzzy];
  const byPopularity = ranked.sort((a, b) => {
    const ai = ranked.indexOf(a);
    const bi = ranked.indexOf(b);
    if (ai < 3 && bi < 3) return b.popularity - a.popularity;
    return 0;
  });

  return byPopularity.slice(0, limit);
}

export function getFoodById(id: string): Food | undefined {
  return FOODS.find((f) => f.id === id);
}

export function getFoodsByIds(ids: string[]): Food[] {
  return ids.map((id) => getFoodById(id)).filter((f): f is Food => Boolean(f));
}

export function getTrendingFoods(limit = 8): Food[] {
  const trending = getFoodsByIds(trendingData.today);
  if (trending.length >= limit) return trending.slice(0, limit);
  const fallback = [...FOODS]
    .sort((a, b) => b.popularity - a.popularity)
    .filter((f) => !trending.includes(f));
  return [...trending, ...fallback].slice(0, limit);
}

export function getRandomFood(exceptId?: string): Food {
  const pool = exceptId ? FOODS.filter((f) => f.id !== exceptId) : FOODS;
  return pickRandom(pool);
}

export function getHardestFoodsToday(limit = 5): Food[] {
  return [...FOODS].sort((a, b) => b.calories - a.calories).slice(0, limit);
}

export function getRandomFoodPair(): [Food, Food] {
  const a = getRandomFood();
  const b = getRandomFood(a.id);
  return [a, b];
}
