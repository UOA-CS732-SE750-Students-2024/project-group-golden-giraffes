import { prisma } from "@/client";
import { ForbiddenError, NotFoundError } from "@/errors";
import BadRequestError from "@/errors/BadRequestError";
import { PixelHistory } from "@blurple-canvas-web/types";

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

/* Ensures that the given pixel coordinates are within the bounds of the canvas, and the canvas exists*/
export async function validatePixel(
  canvasId: number,
  x: number,
  y: number,
  respectLocked: boolean,
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

  if (respectLocked && canvas.locked) {
    throw new ForbiddenError(`Canvas with ID ${canvasId} is locked`);
  }
}

/* Ensures that the given color exists in the DB and is allowed to be used in the given canvas*/
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

export async function validateUser(canvasId: number, userId: bigint) {
  // Check against blacklist
  const blacklist = await prisma.blacklist.findFirst({
    where: {
      user_id: BigInt(userId),
    },
  });

  if (blacklist) {
    throw new ForbiddenError("User is blacklisted");
  }

  // Get the canvas; no optimisations yet
  const canvas = await prisma.canvas.findFirst({
    where: {
      id: canvasId,
    },
  });

  // Check user cooldown
  const cooldown = await prisma.cooldown.findFirst({
    where: {
      user_id: userId,
      canvas_id: canvasId,
    },
  });

  // Return early if no cooldown exists; canvas validation occurs in previous service
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
