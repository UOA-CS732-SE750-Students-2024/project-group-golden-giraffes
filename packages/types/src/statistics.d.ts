import { CanvasInfo } from "./canvasInfo";

export interface UserStats {
  userId: string;
  canvasId: CanvasInfo["id"];
  totalPixels?: number;
  rank?: number;
  mostFrequentColor?: PaletteColor;
  // placeFrequency?: string;  // Not currently supported by Prisma
  mostRecentTimestamp?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  totalPixels: number;
  username: string;
  profilePictureUrl: string;
}
