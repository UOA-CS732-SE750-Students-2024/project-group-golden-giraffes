import crypto from "node:crypto";
import { prisma } from "@/client";
import config from "@/config";
import { getProfilePictureUrlFromHash } from "@/services/discordProfileService";
import { DiscordUserProfile } from "@blurple-canvas-web/types";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
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
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms
      },
      secret: config.expressSessionSecret,
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
