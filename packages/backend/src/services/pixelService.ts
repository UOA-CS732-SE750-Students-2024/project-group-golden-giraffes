import { prisma } from "@/client";
import { NotFoundError } from "@/errors";
import { history } from "@prisma/client";

export async function getPixelHistory(
  canvasId: number,
  xCoordinate: number,
  yCoordinate: number,
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
  if (xCoordinate < 0 || xCoordinate >= canvas.width) {
    throw new NotFoundError(
      `X coordinate ${xCoordinate} is out of bounds for canvas ${canvasId}`, //TODO update to have better error
    );
  }

  if (yCoordinate < 0 || yCoordinate >= canvas.height) {
    throw new NotFoundError(
      `Y coordinate ${yCoordinate} is out of bounds for canvas ${canvasId}`,
    );
  }

  const pixelHistory = await prisma.history.findMany({
    where: {
      canvas_id: canvasId,
      x: xCoordinate,
      y: yCoordinate,
    },
  });
  return pixelHistory;
}
