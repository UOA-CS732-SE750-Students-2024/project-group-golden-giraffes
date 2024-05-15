import { DiscordGuildRecord } from "./discordGuildRecord";
import { DiscordUserProfile } from "./discordUserProfile";

export interface Frame {
  id: string;
  canvasId: number;
  ownerId: string;
  isGuildOwned: boolean;
  ownerUser?: DiscordUserProfile;
  ownerGuild?: DiscordGuildRecord;
  name: string;
  x_0: number;
  y_0: number;
  x_1: number;
  y_1: number;
}
