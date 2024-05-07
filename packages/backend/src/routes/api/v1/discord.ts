import { Router } from "express";
import passport from "passport";

import { DiscordProfile } from "@blurple-canvas-web/types";

import { saveDiscordProfile } from "@/services/discordProfileService";

export const discordRouter = Router();

discordRouter.get("/", passport.authenticate("discord"));

discordRouter.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    const discordProfile = req.user as DiscordProfile;

    res.cookie("profile", JSON.stringify(discordProfile), {
      httpOnly: true,
      secure: true,
    });

    saveDiscordProfile(discordProfile);
    res.json(req.user);
  },
);
