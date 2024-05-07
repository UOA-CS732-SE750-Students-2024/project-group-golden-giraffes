import { Router } from "express";
import passport from "passport";

import { DiscordProfile } from "@blurple-canvas-web/types";

import config from "@/config";
import { saveDiscordProfile } from "@/services/discordProfileService";

export const discordRouter = Router();

discordRouter.get("/", passport.authenticate("discord"));

/**
 * Delete the active session associated with the user. This will invalidate the existing session
 * cookie.
 */
discordRouter.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(204).end();
  });
});

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
