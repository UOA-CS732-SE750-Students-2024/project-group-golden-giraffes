import { ApiError } from "@/errors";
import BadRequestError from "@/errors/BadRequestError";
import {
  CanvasIdParam,
  CanvasIdParamModel,
  PixelHistoryParamModel,
  parseCanvasId,
} from "@/models/paramModels";
import { getPixelHistory } from "@/services/pixelService";
import { Router } from "express";

export const pixelRouter = Router({ mergeParams: true });

pixelRouter.get<CanvasIdParam>("/history", async (req, res) => {
  try {
    // grabbing the canvasId from the path
    const canvasId = await parseCanvasId(req.params);

    // grabbing the x and y from the query
    const queryResult = await PixelHistoryParamModel.safeParseAsync(req.query);
    if (!queryResult.success) {
      throw new BadRequestError(
        "Invalid query parameters. Expected x, and y as positive integers",
        queryResult.error.issues,
      );
    }

    const { x, y } = queryResult.data;
    const pixelHistory = await getPixelHistory(canvasId, x, y);

    res.status(200).json(pixelHistory);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});
