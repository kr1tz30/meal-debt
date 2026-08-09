/**
 * Standard MET formula: calories burned = MET x body weight (kg) x duration (hours)
 */
export function caloriesBurnedForDuration(
  met: number,
  weightKg: number,
  hours: number
): number {
  return met * weightKg * hours;
}

export function minutesToBurnCalories(
  met: number,
  weightKg: number,
  calories: number
): number {
  if (met <= 0 || weightKg <= 0) return 0;
  const hours = calories / (met * weightKg);
  return hours * 60;
}
