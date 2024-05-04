import { prisma } from "@/client";
import { ApiError } from "@/errors";
import BadRequestError from "@/errors/BadRequestError";
import { PlacePixelBodyModel } from "@/models/bodyModels";
import {
  CanvasIdParam,
  PixelHistoryParamModel,
  parseCanvasId,
} from "@/models/paramModels";
import {
  getPixelHistory,
  validateColor,
  validatePixel,
} from "@/services/pixelService";
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

// Temporary post route until branch with ROUTE setup is merged
pixelRouter.post<CanvasIdParam>("/", async (req, res) => {
  // TODO: check for authentication
  // Somehow access to user ID after authentication
  // const userID = "204778476102877187";
  try {
    const result = await PlacePixelBodyModel.safeParseAsync(req.body);
    if (!result.success) {
      throw new BadRequestError("Body is not valid", result.error.issues);
    }
    const data = result.data;

    // grabbing the canvasId from the path
    const canvasId = await parseCanvasId(req.params);

    // TODO: check for canvas discord_only status (not sure which table to look here)
    await validatePixel(canvasId, data.x, data.y, true);
    await validateColor(data.colorId);

    return res.status(200).json({ message: "pixel endpoint1" });
  } catch (error) {
    ApiError.sendError(res, error);
  }

  //

  // Do both of these within one transaction
  // TODO: update users cooldown table
  // TODO: update pixel
  // TODO: create new history field

  // TODO: return status 201 on success

  // res.status(200).json({ message: new Date().valueOf(), other: Date.now() });
});
