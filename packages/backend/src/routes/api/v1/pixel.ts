import { ApiError } from "@/errors";
import { PixelHistoryParamModel } from "@/models/paramModels";
import { getPixelHistory } from "@/services/pixelService";
import { Router } from "express";

export const pixelRouter = Router({ mergeParams: true });

// TODO this route needs canvasId in the query params. find a way to get rid of it
pixelRouter.get("/pixel_history", async (req, res) => {
  try {
    const result = await PixelHistoryParamModel.safeParseAsync(req.query);
    if (!result.success) {
      res.status(400).json({
        message: "Invalid parameters. Expected canvasId, x, and y.",
        errors: result.error.issues,
      });
      return;
    }

    const { canvasId, x, y } = result.data;
    const pixelHistory = await getPixelHistory(canvasId, x, y);

    res.json(pixelHistory);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});
