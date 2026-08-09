export type ComparisonType =
  | "movies"
  | "buildings"
  | "landmarks"
  | "cities"
  | "sports"
  | "daily"
  | "travel"
  | "entertainment";

export interface Comparison {
  id: string;
  type: ComparisonType;
  text: string;
  minCalories: number;
  maxCalories: number;
}
