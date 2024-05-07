import { Strategy as DiscordStrategy } from "passport-discord";

export interface DiscordProfile {
  userId: string;
  username: string;
  profilePictureUrl: string;
}
