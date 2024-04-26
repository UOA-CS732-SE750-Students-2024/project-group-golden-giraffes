import { ApiError } from "@/errors";
import { EventIdParamModel } from "@/models/paramModels";
import {
  getCurrentEventPalette,
  getEventPalette,
} from "@/services/paletteService";
import { Router } from "express";

export const paletteRouter = Router();

paletteRouter.get("/", async (req, res) => {
  try {
    const palette = await getCurrentEventPalette();
    return res.status(200).json(palette);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});

paletteRouter.get("/:eventId", async (req, res) => {
  try {
    const result = await EventIdParamModel.safeParseAsync(req.params);
    if (!result.success) {
      res.status(400).json({
        message: `${req.params.eventId} is not a valid event ID`,
        errors: result.error.issues,
      });
      return;
    }

    const { eventId } = result.data;
    const palette = await getEventPalette(eventId);

    res.status(200).json(palette);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});
