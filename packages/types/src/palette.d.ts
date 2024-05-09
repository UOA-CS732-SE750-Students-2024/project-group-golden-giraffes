export type PixelColor = number[]; // [r, g, b, a]

export interface PaletteColor {
  id: number;
  code: string;
  name: string;
  rgba: number[]; // [r, g, b, a];
  global: boolean;
  invite: string | null;
  guildName: string | null;
  guildId: string;
}

export type Palette = PaletteColor[];
