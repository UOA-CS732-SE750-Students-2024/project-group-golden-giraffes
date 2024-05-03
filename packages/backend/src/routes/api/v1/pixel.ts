import { ApiError } from "@/errors";
import {
  CanvasIdParamModel,
  PixelHistoryParamModel,
} from "@/models/paramModels";
import { getPixelHistory } from "@/services/pixelService";
import { Router } from "express";

export const pixelRouter = Router({ mergeParams: true });

type CanvasParam = {
  canvasId: string;
};

pixelRouter.get<CanvasParam>("/pixel_history", async (req, res) => {
  // grabbing the canvasId from the path
  try {
    console.log(req.query);
    const pathResult = await CanvasIdParamModel.safeParseAsync(req.params);
    if (!pathResult.success) {
      res.status(400).json({
        message: `${req.params.canvasId} is not a valid canvas ID`,
        errors: pathResult.error.issues,
      });
      return;
    }

    const { canvasId } = pathResult.data;

    // grabbing the x and y from the query
    const queryResult = await PixelHistoryParamModel.safeParseAsync(req.query);
    if (!queryResult.success) {
      res.status(400).json({
        message: "Invalid parameters. Expected x, and y.",
        errors: queryResult.error.issues,
      });
      return;
    }

    const { x, y } = queryResult.data;
    const pixelHistory = await getPixelHistory(canvasId, x, y);

    res.json(pixelHistory);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});
