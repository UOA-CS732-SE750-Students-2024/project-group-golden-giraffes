import { DiscordProfile } from "@blurple-canvas-web/types";
import { NextFunction, Request, Response } from "express";

/* This function should be used as a middleware in testing to bypass the need to mock a passport strategy */
export const mockAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.header("x-testuserid");
  const user = {
    accessToken: "",
    refreshToken: "",
    profile: {
      id: userId,
    },
  } as unknown as DiscordProfile;
  req.user = user;
  next();
};
