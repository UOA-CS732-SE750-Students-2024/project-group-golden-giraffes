import { getPixelHistory } from "@/services/pixelService";
import { Router } from "express";

export const pixelRouter = Router();

pixelRouter.get("/pixelHistory", async (req, res) => {
  // hello world
  res.send("Hello, world!");
});
