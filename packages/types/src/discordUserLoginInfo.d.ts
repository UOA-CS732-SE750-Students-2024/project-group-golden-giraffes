import { Strategy as DiscordStrategy } from "passport-discord";

export interface DiscordUserLoginInfo {
  accessToken: string;
  refreshToken: string;
  profile: DiscordStrategy.Profile;
}
