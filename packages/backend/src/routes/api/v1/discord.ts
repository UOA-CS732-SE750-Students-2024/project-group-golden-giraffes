import { Router } from "express";
import passport from "passport";

import { DiscordUserLoginInfo } from "@blurple-canvas-web/types";

import { NotFoundError } from "@/errors";
import {
  getDiscordProfile,
  saveDiscordProfile,
} from "@/services/discordProfileService";

export const discordRouter = Router();

discordRouter.get("/", passport.authenticate("discord"));

discordRouter.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    const { accessToken, refreshToken, profile } =
      req.user as DiscordUserLoginInfo;

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.cookie("profile", JSON.stringify(profile), {
      httpOnly: true,
      secure: true,
    });

    // saving a user's id, name, and profile picture to our database to avoid rate limiting
    const { id: userId, username, avatar: profilePictureHash } = profile;
    saveDiscordProfile(BigInt(userId), username, profilePictureHash);

    res.json(req.user);
  },
);

discordRouter.get("/cache/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await getDiscordProfile(BigInt(userId));
    res.json(profile);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});
