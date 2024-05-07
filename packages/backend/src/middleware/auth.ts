import crypto from "node:crypto";
import { prisma } from "@/client";
import config from "@/config";
import { getProfilePictureUrlFromHash } from "@/services/discordProfileService";
import { DiscordUserProfile } from "@blurple-canvas-web/types";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { IPrisma } from "@quixo3/prisma-session-store/dist/@types";
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
      /*
       * Double cast necessary as using example from https://www.npmjs.com/package/connect-pg-simple
       * results in @prisma/client did not initialize yet.
       */
      store: new PrismaSessionStore(prisma as unknown as IPrisma<"session">, {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
