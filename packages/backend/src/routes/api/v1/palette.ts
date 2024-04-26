import { getPaletteForEvent } from "@/services/paletteService";
import { Router } from "express";

export const paletteRouter = Router();

paletteRouter.get("/", async (req, res) => {
  getPaletteForEvent(2023);
  res.end();
});

paletteRouter.get("/:eventId", async (req, res) => {});
