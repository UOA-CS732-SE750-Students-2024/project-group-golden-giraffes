import { DiscordUserProfile } from "./discordUserProfile";

export interface PixelHistoryRecord {
  id: string;
  color: Pick<PaletteColor, "id" | "code" | "name" | "rgba">;
  timestamp: Date;
  guildId?: string;
  userProfile: DiscordUserProfile;
}

export type PixelHistory = PixelHistoryRecord[];
