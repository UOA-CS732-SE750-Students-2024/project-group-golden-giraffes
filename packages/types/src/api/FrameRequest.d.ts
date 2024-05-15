import { Frame } from "..";

export interface Params {
  frameId?: Frame["id"];
  canvasId?: Frame["canvas_id"];
  userId?: DiscordUserProfile["id"];
  guildIds?: DiscordGuildRecord["guild_id"][];
}

export type ResBody = Frame[];
export type ReqBody = Record<string, never>;
export type ReqQuery = Record<string, never>;
