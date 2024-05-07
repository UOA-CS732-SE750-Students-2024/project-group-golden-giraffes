import { DiscordUserProfile } from "./discordUserProfile";

export interface PixelHistoryRecord {
  id: string;
  userId: string;
  colorId: number;
  timestamp: Date;
  guildId?: string;
  userProfile: DiscordUserProfile;
}
