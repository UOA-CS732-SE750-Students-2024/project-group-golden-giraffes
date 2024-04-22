import { canvas } from "@prisma/client";
import { PNG } from "pngjs";
import { prisma } from "../client";

type PixelColor = number[]; // [r, g, b, a]

interface CanvasPixels {
  width: number;
  height: number;
  pixels: PixelColor[];
}

const canvasCache: Record<number, CanvasPixels> = {};

export function getCanvasFilename(canvasId: number): string {
  return `blurple-canvas__${canvasId}__${Date.now()}.png`;
}

export async function getCanvasPixels(canvas: canvas): Promise<CanvasPixels> {
  const pixels = await prisma.pixel.findMany({
    select: {
      color: {
        select: { rgba: true },
      },
    },
    where: { canvas_id: canvas.id },
    orderBy: [{ y: "asc" }, { x: "asc" }],
  });

  return {
    width: canvas.width,
    height: canvas.height,
    pixels: pixels.map((pixel) => pixel.color.rgba),
  };
}

export function canvasPixelsToPng(canvasPixels: CanvasPixels): PNG {
  const image = new PNG({ width: canvasPixels.width, height: canvasPixels.height, filterType: 0 });

  canvasPixels.pixels.forEach((color, index) => {
    const imageIndex = index * 4;
    image.data[imageIndex] = color[0];
    image.data[imageIndex + 1] = color[1];
    image.data[imageIndex + 2] = color[2];
    image.data[imageIndex + 3] = color[3];
  });

  return image;
}

export async function getCanvasPng(canvasId: number): Promise<PNG | null> {
  if (!canvasCache[canvasId]) {
    console.debug(`Cache miss for canvas: ${canvasId}`);

    const canvas = await prisma.canvas.findFirst({
      where: { id: canvasId },
    });

    if (!canvas) {
      // TODO: Throw error
      return null;
    }

    const canvasPixels = await getCanvasPixels(canvas);
    canvasCache[canvasId] = canvasPixels;
    console.debug(`Canvas cached: ${canvasId}`);
  } else {
    console.debug(`Cache hit for canvas: ${canvasId}`);
  }

  return canvasPixelsToPng(canvasCache[canvasId]);
}
