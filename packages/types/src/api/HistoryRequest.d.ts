import { PixelHistoryRecord } from "..";

export interface Params {
  canvasId: number;
  coordinates?: [number, number];
}

export type ResBody = PixelHistoryRecord[];

export type ReqBody = Record<string, never>;
export type ReqQuery = Record<string, never>;
