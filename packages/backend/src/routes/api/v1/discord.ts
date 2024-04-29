import crypto from "node:crypto";
import config from "@/config";
import { Router } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

export const discordRouter = Router();

const randomSecret = crypto.randomBytes(64).toString("hex");

const discordStrategy = new DiscordStrategy(
  {
    clientID: config.discord.clientId,
    clientSecret: config.discord.clientSecret,
    callbackURL: "/api/v1/discord/callback",
    scope: ["identify"],
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      accessToken,
      refreshToken,
      profile,
    };
    done(null, user);
  },
);

passport.use(discordStrategy);

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser<string>((user, done) => {
  done(null, user);
});

discordRouter.use(
  session({
    secret: randomSecret,
    resave: false,
    saveUninitialized: false,
  }),
);

discordRouter.use(passport.initialize());
discordRouter.use(passport.session());

discordRouter.get("/", passport.authenticate("discord"));

discordRouter.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    res.json(req.user);
  },
);
