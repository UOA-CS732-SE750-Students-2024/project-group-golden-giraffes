export interface Pixel {
  x: number;
  y: number;
  colorId: number;
  // history?: PixelHistory[];
}

export interface PixelHistory {
  userId: string;
  colorId: number;
  timestamp: Date;
  guildId?: string;
}
