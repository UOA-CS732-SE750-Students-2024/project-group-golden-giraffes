import { CanvasInfo } from "./canvasInfo";

export interface BlurpleEvent {
  id: number;
  name: string;
  canvases: CanvasInfo[];
  participants: Participation[];
}
