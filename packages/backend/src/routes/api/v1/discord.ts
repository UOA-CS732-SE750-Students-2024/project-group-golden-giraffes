import crypto from "node:crypto";
import config from "@/config";
import { DiscordUserLoginInfo } from "@blurple-canvas-web/types";
import { Router } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

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

    res.json(req.user);
  },
);

discordRouter.get("/test", (req, res) => {
  console.log("router");
  if (!req.user) {
    res.status(401).json({ message: "Not Authenticated" });
  }
  res.status(201).json({ user: req.user, message: "Authenication Success" });
});
