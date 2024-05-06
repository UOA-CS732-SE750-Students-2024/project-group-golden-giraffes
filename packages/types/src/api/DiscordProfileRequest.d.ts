import { DiscordUserProfile } from "../discordUserProfile";

export interface Params {
  userId: string;
}

export type ResBody = DiscordUserProfile;

export type ReqBody = Record<string, never>;
export type ReqQuery = Record<string, never>;
