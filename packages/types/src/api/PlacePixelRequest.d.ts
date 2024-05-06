import { CanvasInfo, PlacePixel } from "..";

export interface Params {
  canvasId: CanvasInfo["id"];
}

export type ResBody = Date;
export type ReqBody = PlacePixel;
