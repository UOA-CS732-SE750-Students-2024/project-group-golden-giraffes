export interface UserStats {
  userId: string;
  canvasId: number;
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
