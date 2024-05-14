import { DiscordGuildRecord } from "./discordGuildRecord";
import { DiscordUserProfile } from "./discordUserProfile";

export interface Frame {
  id: string;
  canvas_id: number;
  owner_id: string;
  is_guild_owned: boolean;
  owner_user?: DiscordUserProfile;
  owner_guild?: DiscordGuildRecord;
  name: string;
  x_0: number;
  y_0: number;
  x_1: number;
  y_1: number;
}
