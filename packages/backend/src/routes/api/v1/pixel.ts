import { prisma } from "@/client";
import { ApiError } from "@/errors";
import BadRequestError from "@/errors/BadRequestError";
import { PlacePixelBodyModel } from "@/models/bodyModels";
import {
  CanvasIdParam,
  PixelHistoryParamModel,
  parseCanvasId,
} from "@/models/paramModels";
import { getPixelHistory, validatePixel } from "@/services/pixelService";
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

    return res.status(200).json({ message: "pixel endpoint1" });
  } catch (error) {
    ApiError.sendError(res, error);
  }

  // // Check against blacklist
  // const blacklist = await prisma.blacklist.findFirst({
  //   where: {
  //     user_id: BigInt(userID),
  //   },
  // });
  //
  // if (blacklist) {
  //   return res.status(401).json({ message: "User is blacklisted" });
  // }
  //
  // // Check user cooldown
  //
  // const cooldown = await prisma.cooldown.findFirst({
  //   where: {
  //     user_id: BigInt(userID),
  //     canvas_id: canvasId,
  //   },
  // });
  //
  // // Deny if the cooldown time is in the future (alternative to cooldown table is to )
  // // Can't be sure if cooldown handling is being handled in the database side or the server side
  // if (cooldown?.cooldown_time && canvas.cooldown_length) {
  //   const placedCooldown = cooldown.cooldown_time?.valueOf();
  //   // Using milliseconds from unix epoch for calculations
  //   if (placedCooldown + canvas.cooldown_length * 1000 <= Date.now()) {
  //     return res
  //       .status(403)
  //       .json({ message: "Pixel placement is on cooldown" });
  //   }
  // }
  //
  // // check for color (also not allow for partnered colours)
  // // temped to hard code this even
  // const color = await prisma.color.findFirst({
  //   where: {
  //     id: body.color,
  //   },
  // });
  //
  // if (!color) {
  //   return res.status(400).json({ message: "Invalid pixel color" });
  // }
  //
  // if (!color.global) {
  //   return res
  //     .status(400)
  //     .json({ message: "Partnered colours not allowed from web client" });
  // }

  // Do both of these within one transaction
  // TODO: update users cooldown table
  // TODO: update pixel
  // TODO: create new history field

  // TODO: return status 201 on success

  // res.status(200).json({ message: new Date().valueOf(), other: Date.now() });
});
