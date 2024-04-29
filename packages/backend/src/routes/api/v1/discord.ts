import config from "@/config";
import { Router } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

export const discordRouter = Router();

const dev = process.env.NODE_ENV !== "production";

const discordStrategy = new DiscordStrategy(
  {
    clientID: config.discord.clientId,
    clientSecret: config.discord.clientSecret,
    callbackURL:
      dev ?
        "http://localhost:8000/api/v1/discord/callback"
      : "https://canvas.projectblurple.com/api/v1/discord/callback",
    scope: ["identify"],
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  },
);

passport.use(discordStrategy);

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser(
  (user: false | Express.User | null | undefined, done) => {
    done(null, user);
  },
);

discordRouter.use(
  session({
    secret: process.env.SESSION_SECRET || "",
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
    res.redirect("/");
  },
);
