import crypto from "node:crypto";
import config from "@/config";
import { getProfilePictureUrlFromHash } from "@/services/discordProfileService";
import { DiscordUserProfile } from "@blurple-canvas-web/types";
import { Express } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

const randomSecret = crypto.randomBytes(64).toString("hex");

const discordStrategy = new DiscordStrategy(
  {
    clientID: config.discord.clientId,
    clientSecret: config.discord.clientSecret,
    callbackURL: "/api/v1/discord/callback",
    scope: ["identify"],
  },
  (_accessToken, _refreshToken, profile, done) => {
    const user: DiscordUserProfile = {
      id: profile.id,
      username: profile.username,
      profilePictureUrl: getProfilePictureUrlFromHash(
        BigInt(profile.id),
        profile.avatar,
      ),
    };

    done(null, user);
  },
);

export function initializeAuth(app: Express) {
  passport.use(discordStrategy);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser<DiscordUserProfile>((user, done) => {
    done(null, user);
  });

  app.use(
    session({
      secret: randomSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
