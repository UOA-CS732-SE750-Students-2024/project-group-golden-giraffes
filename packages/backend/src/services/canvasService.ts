import { canvas } from "@prisma/client";
import { PNG } from "pngjs";
import { prisma } from "../client";
import fs from 'node:fs';
import config from "../config";

type PixelColor = number[]; // [r, g, b, a]

interface LockedCanvas {
  isLocked: true;
  canvasPath: string;
}

interface CanvasPixels {
  isLocked: false;
  width: number;
  height: number;
  pixels: PixelColor[];
}

type CachedCanvas = LockedCanvas | CanvasPixels;

const canvasCache: Record<number, CachedCanvas> = {};

export function getCanvasFilename(canvasId: number, isLocked = false): string {
  return `blurple-canvas__${canvasId}__${isLocked ? "locked" : Date.now()}.png`;
}

export async function getCanvasPixels(canvas: canvas): Promise<PixelColor[]> {
  const pixels = await prisma.pixel.findMany({
    select: {
      color: {
        select: { rgba: true },
      },
    },
    where: { canvas_id: canvas.id },
    orderBy: [{ y: "asc" }, { x: "asc" }],
  });

  return pixels.map((pixel) => pixel.color.rgba);

}

export function canvasPixelsToPng(canvasPixels: CanvasPixels): PNG {
  return pixelsToPng(canvasPixels.width, canvasPixels.height, canvasPixels.pixels);
}

export function pixelsToPng(width: number, height: number, pixels: PixelColor[]): PNG {
  const image = new PNG({ width, height, filterType: 0 });

  pixels.forEach((color, index) => {
    const imageIndex = index * 4;
    image.data[imageIndex] = color[0];
    image.data[imageIndex + 1] = color[1];
    image.data[imageIndex + 2] = color[2];
    image.data[imageIndex + 3] = color[3];
  });

  return image;
}

export function saveCanvasToFilesystem(canvas: canvas, pixels: PixelColor[]): string {
  const filename = getCanvasFilename(canvas.id, canvas.locked);
  const path = `${config.rootDirectory}/static/canvas/${filename}`;

  pixelsToPng(canvas.width, canvas.height, pixels).pack().pipe(fs.createWriteStream(path));

  return path;
}

export async function getCanvasPng(canvasId: number): Promise<CachedCanvas | null> {
  if (!canvasCache[canvasId]) {
    console.debug(`Cache miss for canvas: ${canvasId}`);

    const canvas = await prisma.canvas.findFirst({
      where: { id: canvasId },
    });

    if (!canvas) {
      // TODO: Throw error
      return null;
    }

    const pixels = await getCanvasPixels(canvas);
    const canvasPixels: CanvasPixels = {
      isLocked: false,
      width: canvas.width,
      height: canvas.height,
      pixels,
    }

    if (canvas.locked) {
      console.debug(`Canvas is locked, saving to filesystem: ${canvasId}`);

      const path = saveCanvasToFilesystem(canvas, pixels);
      canvasCache[canvasId] = {
        isLocked: true,
        canvasPath: path,
      };

      console.debug(`Canvas saved to filesystem: ${canvasId} -> ${path}`);
    } else {
      canvasCache[canvasId] = canvasPixels;
      console.debug(`Canvas cached: ${canvasId}`);
    }

    return canvasPixels;
  }

  console.debug(`Cache hit for canvas: ${canvasId}`);
  return canvasCache[canvasId];
}
