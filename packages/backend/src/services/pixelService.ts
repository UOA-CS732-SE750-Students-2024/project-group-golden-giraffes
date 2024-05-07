import { prisma } from "@/client";
import config from "@/config";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/errors";
import {
  PaletteColor,
  PixelHistoryRecord,
  PixelInfo,
  Point,
} from "@blurple-canvas-web/types";
import { color } from "@prisma/client";
import { updateCachedCanvasPixel } from "./canvasService";

/**
 * Gets the pixel history for the given canvas and coordinates
 *
 * @param canvasId - The ID of the canvas
 * @param point - The coordinates of the pixel
 */
export async function getPixelHistory(
  canvasId: number,
  point: Point,
): Promise<PixelHistoryRecord[]> {
  // check if canvas exists
  await validatePixel(canvasId, point, false);

  const pixelHistory = await prisma.history.findMany({
    select: {
      id: true,
      user_id: true,
      color_id: true,
      timestamp: true,
      guild_id: true,
    },
    where: {
      canvas_id: canvasId,
      ...point,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return pixelHistory.map((history) => ({
    id: history.id.toString(),
    userId: history.user_id.toString(),
    colorId: history.color_id,
    timestamp: history.timestamp,
    guildId: history.guild_id?.toString(),
  }));
}

/** Ensures that the given pixel coordinates are within the bounds of the canvas and the canvas exists
 *
 * @param canvasId - The ID of the canvas
 * @param point - The coordinates of the pixel
 * @param honorLocked - True will return an error if the canvas is locked
 */
export async function validatePixel(
  canvasId: number,
  point: Point,
  honorLocked: boolean,
) {
  const canvas = await prisma.canvas.findFirst({
    where: {
      id: canvasId,
    },
  });

  if (!canvas) {
    throw new NotFoundError(`There is no canvas with ID ${canvasId}`);
  }

  // check if pixel is within bounds
  if (point.x < 0 || point.x >= canvas.width) {
    throw new BadRequestError(
      `X coordinate ${point.x} is out of bounds for canvas ${canvasId}`,
    );
  }

  if (point.y < 0 || point.y >= canvas.height) {
    throw new BadRequestError(
      `Y coordinate ${point.y} is out of bounds for canvas ${canvasId}`,
    );
  }

  if (honorLocked && canvas.locked) {
    throw new ForbiddenError(`Canvas with ID ${canvasId} is locked`);
  }
}

/**
 * Ensures that the given color exists in the DB and it is allowed to be used in the given canvas
 *
 * @param colorId - The ID of the color
 * @returns The corresponding color object
 */
export async function validateColor(colorId: number): Promise<color> {
  const color = await prisma.color.findFirst({
    where: {
      id: colorId,
    },
  });
  //
  if (!color) {
    throw new NotFoundError(`There is no color with ID ${colorId}`);
  }

  if (!color.global) {
    throw new ForbiddenError(
      `Partnered color with ID ${colorId} is not allowed from web client`,
    );
  }

  return color;
}

/**
 * Ensures that the given user is not blacklisted from using the canvas
 * and their pixel placement is not on cooldown
 */
export async function validateUser(canvasId: number, userId: bigint) {
  const [blacklist, canvas, cooldown] = await Promise.all([
    prisma.blacklist.findFirst({
      where: {
        user_id: userId,
      },
    }),
    prisma.canvas.findFirst({
      where: {
        id: canvasId,
      },
    }),
    prisma.cooldown.findFirst({
      where: {
        user_id: userId,
        canvas_id: canvasId,
      },
    }),
  ]);

  if (blacklist) {
    throw new ForbiddenError("User is blacklisted");
  }

  // Return early if no cooldown exists
  if (!canvas?.cooldown_length || !cooldown || !cooldown?.cooldown_time) {
    return;
  }

  const cooldownTimeStamp = cooldown?.cooldown_time.valueOf();
  const cooldownLength = canvas.cooldown_length;

  // Deny if the cooldown time is in the future (alternative to cooldown table is to )
  // Can't be sure if cooldown handling is being handled in the database side or the server side
  // Using milliseconds from unix epoch for calculations
  if (cooldownTimeStamp + cooldownLength * 1000 > Date.now()) {
    throw new ForbiddenError("Pixel placement is on cooldown");
  }
}

/**
 * Places a pixel in the given canvas and updates the cooldown and history tables
 *
 * @remarks
 *
 * This function assumes that the user already exists in the DB,
 * however the placement still works if the user doesn't exist.
 *
 * @param canvasId - The ID of the canvas
 * @param userId - The ID of the user
 * @param point - The coordinates of the pixel
 * @param color - The color of the pixel
 * @param cooldownTimeStamp - The timestamp of when the user can place another pixel
 */
export async function placePixel(
  canvasId: number,
  userId: bigint,
  point: Point,
  color: Pick<PaletteColor, "id" | "rgba">,
  cooldownTimeStamp: Date,
) {
  await prisma.$transaction(async (tx) => {
    await tx.cooldown.upsert({
      where: {
        user_id_canvas_id: {
          user_id: userId,
          canvas_id: canvasId,
        },
      },
      create: {
        user_id: userId,
        canvas_id: canvasId,
        cooldown_time: cooldownTimeStamp,
      },
      update: {
        cooldown_time: cooldownTimeStamp,
      },
    });

    await tx.pixel.upsert({
      where: {
        canvas_id_x_y: {
          canvas_id: canvasId,
          ...point,
        },
      },
      create: {
        canvas_id: canvasId,
        ...point,
        color_id: color.id,
      },
      update: {
        color_id: color.id,
      },
    });

    await tx.history.create({
      data: {
        user_id: userId,
        canvas_id: canvasId,
        ...point,
        color_id: color.id,
        timestamp: cooldownTimeStamp,
        guild_id: config.webGuildId,
      },
    });

    // Only update the cache if the transaction is successful
    updateCachedCanvasPixel(canvasId, point, color.rgba);
  });
}
