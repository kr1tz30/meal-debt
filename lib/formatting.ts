import { WorkoutResult } from "@/types/result";

export function formatDuration(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  const totalMinutes = Math.round(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function formatFloors(floors: number): string {
  return `${Math.round(floors)} floors`;
}

export function formatCalories(calories: number): string {
  return calories.toLocaleString("en-IN");
}

export function pluralizeServing(servingName: string, quantity: number): string {
  if (quantity === 1) return servingName;
  const match = servingName.match(/^(\d+)\s+(.+)$/);
  if (match) {
    const baseCount = parseInt(match[1], 10) * quantity;
    return `${baseCount} ${match[2]}`;
  }
  if (/s$/i.test(servingName)) return `${quantity} x ${servingName}`;
  return `${quantity} ${servingName}s`;
}

export function formatQuantityLabel(foodName: string, quantity: number): string {
  if (quantity === 1) return foodName;
  return `${quantity} x ${foodName}`;
}

export function formatWorkoutMetrics(workout: WorkoutResult): { headline: string; sub?: string } {
  const { activity, distanceKm, floors, minutes } = workout;
  if (activity.displayType === "distance" && distanceKm !== undefined) {
    return { headline: formatDistance(distanceKm), sub: `≈ ${formatDuration(minutes)}` };
  }
  if (activity.displayType === "floors" && floors !== undefined) {
    return { headline: formatFloors(floors), sub: `≈ ${formatDuration(minutes)}` };
  }
  return { headline: formatDuration(minutes) };
}

export function formatWorkoutShort(workout: WorkoutResult): string {
  const { activity, distanceKm, floors, minutes } = workout;
  if (activity.displayType === "distance" && distanceKm !== undefined) {
    return `${formatDistance(distanceKm)} ${activity.name}`;
  }
  if (activity.displayType === "floors" && floors !== undefined) {
    return `${formatFloors(floors)}`;
  }
  return `${formatDuration(minutes)} ${activity.name}`;
}
