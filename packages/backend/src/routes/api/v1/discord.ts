import { createDefaultAvatarUrl, createOrUpdateDiscordProfile } from "@/services/discordProfileService";
import { DiscordUserLoginInfo } from "@blurple-canvas-web/types";
import { Router } from "express";
import passport from "passport";

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
    const { id, username, avatar } = profile;
    const userId = BigInt(id);
    let profilePictureUrl = "";
    if (!avatar) {
      profilePictureUrl = createDefaultAvatarUrl(userId);
    } else {
      profilePictureUrl = avatar;
    }

    const discordProfile = {
      user_id: userId,
      username,
      profile_picture_url: profilePictureUrl,
    };
    createOrUpdateDiscordProfile(discordProfile);

    res.json(req.user);
  },
);
