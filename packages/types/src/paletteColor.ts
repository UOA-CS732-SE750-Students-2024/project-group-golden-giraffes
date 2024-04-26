interface Color {
  id: number;
  code: string;
  name: string;
  rgba: number[]; // [r, g, b, a]
}

export interface GlobalColor extends Color {
  global: true;
  invite: null;
}

export interface PartnerColor extends Color {
  global: false;
  invite: string;
}

export type PaletteColor = GlobalColor | PartnerColor;
