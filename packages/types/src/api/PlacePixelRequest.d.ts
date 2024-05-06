import { CanvasInfo, PixelInfo } from "..";

export interface Params {
  canvasId: CanvasInfo["id"];
}

export type ResBody = Date;
export type ReqBody = PixelInfo;
