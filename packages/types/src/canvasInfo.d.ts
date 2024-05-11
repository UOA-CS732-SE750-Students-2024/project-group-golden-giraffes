export interface CanvasInfo {
  id: number;
  name: string;
  width: number;
  height: number;
  startCoordinates: [number, number];
  isLocked: boolean;
  eventId: number | null;
  webPlacingEnabled: boolean;
  discordServerInvite: string | null;
}

export type CanvasSummary = Pick<CanvasInfo, "id" | "name" | "eventId">;
