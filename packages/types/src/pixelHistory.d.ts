import { DiscordUserProfile } from "./discordUserProfile";

export interface PixelHistoryRecord {
  id: string;
  color: PaletteColor;
  timestamp: Date;
  guildId?: string;
  userId: string;
  userProfile?: DiscordUserProfile;
}

export type PixelHistory = PixelHistoryRecord[];
