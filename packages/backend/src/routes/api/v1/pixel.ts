import { ApiError } from "@/errors";
import BadRequestError from "@/errors/BadRequestError";
import UnauthorisedError from "@/errors/UnauthorisedError";
import { PlacePixelBodyModel } from "@/models/bodyModels";
import {
  CanvasIdParam,
  PixelHistoryParamModel,
  parseCanvasId,
} from "@/models/paramModels";
import {
  getPixelHistory,
  placePixel,
  validateColor,
  validatePixel,
  validateUser,
} from "@/services/pixelService";
import { PlacePixel } from "@blurple-canvas-web/types";
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

/* Endpoint for placing a pixel on the canvas
 * Requires the user to be authenticated and not blacklisted
 * */
pixelRouter.post<CanvasIdParam>("/", async (req, res) => {
  try {
    const coolDownTimeStamp = new Date();
    const result = await PlacePixelBodyModel.safeParseAsync(req.body);
    if (!result.success) {
      throw new BadRequestError("Body is not valid", result.error.issues);
    }
    const data: PlacePixel = result.data;

    // grabbing the canvasId from the path
    const canvasId = await parseCanvasId(req.params);

    if (!req.user) {
      throw new UnauthorisedError("User is not authenticated");
    }
    const userId = req.user?.profile.id;
    if (!req.user?.profile.id) {
      throw new BadRequestError("UserId does not exist");
    }
    // TODO: check for canvas discord_only status (not sure which table to look here)
    await validatePixel(canvasId, data.x, data.y, true);
    await validateColor(data.colorId);
    await validateUser(canvasId, BigInt(userId));
    await placePixel(canvasId, BigInt(userId), data, coolDownTimeStamp);

    return res.status(201).json({ coolDownTimeStamp: coolDownTimeStamp });
  } catch (error) {
    ApiError.sendError(res, error);
  }
});
