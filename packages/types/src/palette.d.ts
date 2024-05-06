export interface PaletteColor {
  id: number;
  code: string;
  name: string;
  rgba: number[]; // [r, g, b, a]
  global: boolean;
  invite: string | null;
}

export type Palette = PaletteColor[];
