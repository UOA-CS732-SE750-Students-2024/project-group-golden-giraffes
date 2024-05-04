import { PaletteColor } from "..";

export interface Params {
  eventId: PaletteColor["id"];
}

export type ResBody = PaletteColor[];

export type ReqBody = Record<string, never>;
export type ReqQuery = Record<string, never>;
