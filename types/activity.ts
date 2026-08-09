export type DisplayType = "distance" | "time" | "floors";

export interface Activity {
  id: string;
  name: string;
  emoji: string;
  met: number;
  displayType: DisplayType;
  averageSpeedKmh?: number;
  displayUnit: string;
  color: string;
  description: string;
}
