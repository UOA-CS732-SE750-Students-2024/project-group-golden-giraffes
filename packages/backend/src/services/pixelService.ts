import { prisma } from "@/client";
import { NotFoundError } from "@/errors";
import BadRequestError from "@/errors/BadRequestError";
import { PixelHistoryRecord } from "@blurple-canvas-web/types";

export async function getPixelHistory(
  canvasId: number,
  x: number,
  y: number,
): Promise<PixelHistoryRecord[]> {
  // check if canvas exists
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
      x: x,
      y: y,
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
