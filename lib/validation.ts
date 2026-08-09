import { MAX_QUANTITY, MIN_QUANTITY } from "./config";

export function clampQuantity(value: number): number {
  if (Number.isNaN(value)) return MIN_QUANTITY;
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.round(value)));
}

export function clampWeightKg(value: number): number {
  if (Number.isNaN(value)) return 70;
  return Math.min(200, Math.max(30, Math.round(value)));
}
