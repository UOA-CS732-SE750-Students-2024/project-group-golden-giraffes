export interface UserStats {
  userId: string;
  canvasId: number;
  totalPixels: number;
  rank: number;
  mostFrequentColor: PaletteColor;
  // placeFrequency: string;  // Not currently supported by Prisma
  mostRecentTimestamp: string;
}

export interface LeaderboardRow {
  rank: number;
  userId: string;
  canvasId: number;
  totalPixels: number;
}
