import { Participation } from "./Participation";
import { PixelHistory } from "./pixelHistory";

export interface Guild {
  id: number;
  managerRole: number;
  invite: string;
  history: PixelHistory[];
  participations: Participation[];
  // stats: GuildStats[];
  // leaderboard: unknown[];
}
