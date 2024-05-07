import { Router } from "express";
import passport from "passport";

import { DiscordProfile } from "@blurple-canvas-web/types";

import config from "@/config";
import { saveDiscordProfile } from "@/services/discordProfileService";

export const discordRouter = Router();

discordRouter.get("/", passport.authenticate("discord"));

discordRouter.get(
  "/callback",
  passport.authenticate("discord", {
    failureRedirect: config.discord.loginRedirectUrl,
  }),
  (req, res) => {
    const discordProfile = req.user as DiscordProfile;

    res.cookie("profile", JSON.stringify(discordProfile), {
      httpOnly: false, // Allow the frontend to read the cookie
      secure: true,
    });

    saveDiscordProfile(discordProfile);
    res.redirect(config.discord.loginRedirectUrl);
  },
);
