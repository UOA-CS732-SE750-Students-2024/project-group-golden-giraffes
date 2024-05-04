export interface CanvasInfo {
  id: number;
  name: string;
  width: number;
  height: number;
  startCoordinates: [number, number];
  isLocked: boolean;
  eventId: number | null;
}

export interface CanvasSummary {
  id: number;
  name: string;
}
