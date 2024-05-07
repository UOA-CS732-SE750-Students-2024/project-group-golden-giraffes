import { Cooldown } from "@/cooldown";
import { CanvasInfo, PixelInfo } from "..";

export interface Params {
  canvasId: CanvasInfo["id"];
}

export type ResBody = Cooldown;
export type ReqBody = PixelInfo;
