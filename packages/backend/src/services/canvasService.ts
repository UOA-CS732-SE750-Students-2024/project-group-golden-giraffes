import fs from "node:fs";
import { canvas } from "@prisma/client";
import { PNG } from "pngjs";
import { prisma } from "../client";
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

/**
 * An in-memory cache of canvases. Each canvas is either the width, height and pixels of the image
 * or if the image is locked (and therefore cannot be modified) the path to the canvas image on the
 * filesystem.
 */
const CANVAS_CACHE: Record<number, CachedCanvas> = {};

export function getCanvasFilename(canvasId: number, isLocked = false): string {
  return `blurple-canvas__${canvasId}__${isLocked ? "locked" : Date.now()}.png`;
}

export function canvasPixelsToPng(canvasPixels: CanvasPixels): PNG {
  return pixelsToPng(
    canvasPixels.width,
    canvasPixels.height,
    canvasPixels.pixels,
  );
}

export async function getCanvasPng(
  canvasId: number,
): Promise<CachedCanvas | null> {
  if (!CANVAS_CACHE[canvasId]) {
    return cacheCanvas(canvasId);
  }

  console.debug(`Cache hit for canvas: ${canvasId}`);
  return CANVAS_CACHE[canvasId];
}

async function getCanvasPixels(canvas: canvas): Promise<PixelColor[]> {
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

function pixelsToPng(width: number, height: number, pixels: PixelColor[]): PNG {
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

function saveCanvasToFilesystem(canvas: canvas, pixels: PixelColor[]): string {
  const filename = getCanvasFilename(canvas.id, canvas.locked);
  const path = `${config.paths.canvases}/${filename}`;

  pixelsToPng(canvas.width, canvas.height, pixels)
    .pack()
    .pipe(fs.createWriteStream(path));

  return path;
}

async function cacheCanvas(canvasId: number): Promise<CachedCanvas | null> {
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
  };

  if (canvas.locked) {
    const path = saveCanvasToFilesystem(canvas, pixels);
    CANVAS_CACHE[canvasId] = {
      isLocked: true,
      canvasPath: path,
    };

    console.debug(`Canvas saved to filesystem: ${canvasId} -> ${path}`);
  } else {
    CANVAS_CACHE[canvasId] = canvasPixels;
    console.debug(`Canvas cached: ${canvasId}`);
  }

  // We always want to return the pixels, even if the image is locked as sometimes the image
  // hasn't finished being written to the filesystem when express tries to send it in the response.
  return canvasPixels;
}
