import { prisma } from "@/client";
import { NotFoundError } from "@/errors";
import BadRequestError from "@/errors/BadRequestError";
import { history } from "@prisma/client";

export async function getPixelHistory(
  canvasId: number,
  x: number,
  y: number,
): Promise<history[]> {
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
    where: {
      canvas_id: canvasId,
      x: x,
      y: y,
    },
  });
  return pixelHistory;
}
