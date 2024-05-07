import { prisma } from "@/client";
import config from "@/config";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/errors";
import { PixelHistory, PixelInfo } from "@blurple-canvas-web/types";

/**
 * Gets the pixel history for the given canvas and coordinates
 *
 * @param canvasId - The ID of the canvas
 * @param x - The x coordinate of the pixel
 * @param y - The y coordinate of the pixel
 */
export async function getPixelHistory(
  canvasId: number,
  x: number,
  y: number,
): Promise<PixelHistory[]> {
  // check if canvas exists
  await validatePixel(canvasId, x, y, false);

  const pixelHistory = await prisma.history.findMany({
    select: { user_id: true, color_id: true, timestamp: true, guild_id: true },
    where: {
      canvas_id: canvasId,
      x: x,
      y: y,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return pixelHistory.map((history) => ({
    userId: history.user_id.toString(),
    colorId: history.color_id,
    timestamp: history.timestamp,
    guildId: history.guild_id?.toString(),
  }));
}

/** Ensures that the given pixel coordinates are within the bounds of the canvas and the canvas exists
 *
 * @param canvasId - The ID of the canvas
 * @param x - The x coordinate of the pixel
 * @param y - The y coordinate of the pixel
 * @param honorLocked - True will return an error if the canvas is locked
 */
export async function validatePixel(
  canvasId: number,
  x: number,
  y: number,
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
  if (x < 0 || x >= canvas.width) {
    throw new BadRequestError(
      `X coordinate ${x} is out of bounds for canvas ${canvasId}`,
    );
  }

  if (y < 0 || y >= canvas.height) {
    throw new BadRequestError(
      `Y coordinate ${y} is out of bounds for canvas ${canvasId}`,
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
 */
export async function validateColor(colorId: number) {
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
}

/**
 * Ensures that the given user is not blacklisted from using the canvas
 * and their pixel placement is not on cooldown
 */
export async function validateUser(userId: bigint) {
  const blacklist = await prisma.blacklist.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (blacklist) {
    throw new ForbiddenError("User is blacklisted");
  }
}

/**
 * Gets the current and future (after pixel placement) cooldown time for the given canvas
 *
 * @param canvasId - The ID of the canvas
 * @param userId - The ID of the user
 * @param placementTime - The time that the pixel will be placed
 *
 * @returns The current and future cooldown time
 */
export async function getCooldown(
  canvasId: number,
  userId: bigint,
  placementTime: Date,
) {
  const canvas = await prisma.canvas.findFirst({
    where: {
      id: canvasId,
    },
  });
  const cooldown = await prisma.cooldown.findFirst({
    where: {
      user_id: userId,
      canvas_id: canvasId,
    },
  });

  // Don't need to return cooldown if canvas itself doesn't have cooldown
  if (!canvas?.cooldown_length) {
    return { currentCooldown: null, futureCooldown: null };
  }

  const futureCooldown = new Date(
    placementTime.valueOf() + canvas.cooldown_length * 1000,
  );

  // Return early if no cooldown exists
  if (!cooldown || !cooldown?.cooldown_time) {
    return { currentCooldown: null, futureCooldown };
  }

  const currentCooldown = cooldown.cooldown_time;

  if (placementTime <= currentCooldown) {
    throw new ForbiddenError("Pixel placement is on cooldown");
  }
  return { currentCooldown, futureCooldown };
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
 * @param placePixel - The pixel to place with coordinates and color
 * @param placementTime - The time that the pixel will be placed
 */
export async function placePixel(
  canvasId: number,
  userId: bigint,
  { x, y, colorId }: PixelInfo,
) {
  const placementTime = new Date();
  let { currentCooldown, futureCooldown } = await getCooldown(
    canvasId,
    userId,
    placementTime,
  );

  await prisma.$transaction(async (tx) => {
    // only place a pixel if the canvas has a cooldown
    if (futureCooldown) {
      // create the cooldown if it doesn't exist already
      if (!currentCooldown) {
        const cooldown = await tx.cooldown.create({
          data: {
            user_id: userId,
            canvas_id: canvasId,
            cooldown_time: futureCooldown,
          },
        });
        currentCooldown = cooldown.cooldown_time;
      }
      // Perform an update with an attempt at an optimistic query
      const updateCooldown = await tx.cooldown.update({
        where: {
          user_id_canvas_id: {
            user_id: userId,
            canvas_id: canvasId,
          },
          cooldown_time: currentCooldown,
        },
        data: {
          cooldown_time: futureCooldown,
        },
      });
      if (!updateCooldown) {
        throw new ForbiddenError("Pixel placement is on cooldown");
      }
    }
    tx.pixel.upsert({
      where: {
        canvas_id_x_y: {
          canvas_id: canvasId,
          x: x,
          y: y,
        },
      },
      create: {
        canvas_id: canvasId,
        x: x,
        y: y,
        color_id: colorId,
      },
      update: {
        color_id: colorId,
      },
    });

    tx.history.create({
      data: {
        user_id: userId,
        canvas_id: canvasId,
        x: x,
        y: y,
        color_id: colorId,
        timestamp: placementTime,
        guild_id: config.webGuildId,
      },
    });
  });
  return { futureCooldown };
}
