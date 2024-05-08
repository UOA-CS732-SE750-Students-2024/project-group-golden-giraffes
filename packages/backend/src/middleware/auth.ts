import { prisma } from "@/client";
import config from "@/config";
import { getProfilePictureUrlFromHash } from "@/services/discordProfileService";
import { DiscordUserProfile } from "@blurple-canvas-web/types";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { Express, NextFunction, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

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
      // having a random secret would mess with persistent sessions
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

export async function authenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  const apiKey = req.header("x-api-key");

  if (apiKey && config.botApiKey && apiKey === config.botApiKey) {
    const userId = req.header("x-user-id");
    if (!userId) {
      res.status(401).json({
        message:
          "Missing required x-user-id header indicating user the bot is acting on behalf of",
      });
      return;
    }

    const profile = await prisma.discord_user_profile.findUnique({
      where: { user_id: BigInt(userId) },
    });

    if (!profile) {
      res.status(401).json({
        message: "No profile found for the user id provided in the header",
      });
      return;
    }

    req.user = {
      id: profile.user_id.toString(),
      username: profile.username,
      profilePictureUrl: profile.profile_picture_url,
    };

    next();
    return;
  }

  res
    .status(401)
    .json({ message: "You need to be authenticated to use this endpoint" });
}
