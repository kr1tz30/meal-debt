import { Activity } from "@/types/activity";
import { FLOORS_PER_MINUTE } from "./config";

export function minutesToDistanceKm(minutes: number, activity: Activity): number {
  if (!activity.averageSpeedKmh) return 0;
  return (minutes / 60) * activity.averageSpeedKmh;
}

export function minutesToFloors(minutes: number): number {
  return minutes * FLOORS_PER_MINUTE;
}
