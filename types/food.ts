export interface Food {
  id: string;
  name: string;
  aliases: string[];
  emoji: string;
  category: string;
  cuisine: string;
  servingName: string;
  servingWeightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  popularity: number;
  source: string;
}
