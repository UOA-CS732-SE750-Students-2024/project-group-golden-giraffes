export interface UserStats {
  userId: string;
  canvasId: number;
  totalPixels: number;
  rank: number;
  mostFrequentColorId: number;
  placeFrequency: string;
  mostRecentTimestamp: string;
}

export interface LeaderboardRow {
  rank: number;
  userId: string;
  canvasId: number;
  totalPixels: number;
}
