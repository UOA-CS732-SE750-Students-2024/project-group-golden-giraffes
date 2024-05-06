import fs from "node:fs";
import { prisma } from "@/client";
import config from "@/config";
import { NotFoundError } from "@/errors";
import { CanvasInfo, CanvasSummary } from "@blurple-canvas-web/types";
import { canvas } from "@prisma/client";
import { PNG } from "pngjs";

type PixelColor = number[]; // [r, g, b, a]

/**
 * A locked canvas cannot be edited by users. It is therefore, safe to store it as an image on the
 * file system.
 */
interface LockedCanvas {
  isLocked: true;
  canvasPath: string;
}

/**
 * An unlocked canvas can be edited by users so the pixels are stored in memory. This allows for
 * easy updating of the canvas, while also allowing it to be rapidly returned from requests (as
 * most of the time to build a canvas image from scratch is fetching the pixels from the database).
 */
interface UnlockedCanvas {
  isLocked: false;
  width: number;
  height: number;
  pixels: PixelColor[];
}

export type CachedCanvas = LockedCanvas | UnlockedCanvas;

/**
 * An in-memory cache of canvases. Each canvas is either the width, height and pixels of the image
 * or if the image is locked (and therefore cannot be modified) the path to the canvas image on the
 * file system.
 */
const CANVAS_CACHE: Record<number, CachedCanvas> = {};

/**
 * Generates a filename for a canvas image. If the canvas is not locked (And therefore, can change)
 * the filename will include the current timestamp.
 *
 * @param canvasId The ID of the canvas
 * @param isLocked Whether the canvas is locked or not
 * @returns The generated filename
 */
export function getCanvasFilename(canvasId: number, isLocked = false): string {
  return `blurple-canvas__${canvasId}__${isLocked ? "locked" : Date.now()}.png`;
}

/**
 * Converts an unlocked canvas from the cache to a PNG image.
 *
 * @param unlockedCanvas The unlocked canvas to convert
 * @returns The PNG image
 */
export function unlockedCanvasToPng(unlockedCanvas: UnlockedCanvas): PNG {
  return pixelsToPng(
    unlockedCanvas.width,
    unlockedCanvas.height,
    unlockedCanvas.pixels,
  );
}

/**
 * Retrieves canvas summary info for all canvases.
 *
 * @returns The canvas summary info of all canvases
 */
export async function getCanvases(): Promise<CanvasSummary[]> {
  const canvases = await prisma.canvas.findMany({
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return canvases;
}

/**
 * Retrieves canvas info from the cache of the default canvas ID defined in the database.
 *
 * @returns The canvas info of the default canvas
 */
export async function getCurrentCanvasInfo(): Promise<CanvasInfo> {
  const info = await prisma.info.findFirst({
    select: { default_canvas_id: true },
  });

  // To get rid of the nullable type from info. This should never happen
  if (!info) {
    throw new Error("The info table is empty! 😱");
  }

  return getCanvasInfo(info.default_canvas_id);
}

/**
 * Retrieves the info for a canvas.
 *
 * @param canvasId The ID of the canvas to retrieve the info for
 * @returns The canvas info
 */
export async function getCanvasInfo(canvasId: number): Promise<CanvasInfo> {
  const info = await prisma.info.findFirst({
    select: { default_canvas_id: true },
  });

  const canvas = await prisma.canvas.findFirst({
    select: {
      id: true,
      name: true,
      width: true,
      height: true,
      start_coordinates: true,
      locked: true,
      event_id: true,
    },
    where: {
      id: canvasId,
    },
  });

  if (!canvas) {
    throw new NotFoundError(`There is no canvas with ID ${canvasId}`);
  }

  return {
    id: canvas.id,
    name: canvas.name,
    width: canvas.width,
    height: canvas.height,
    startCoordinates: [
      canvas.start_coordinates[0],
      canvas.start_coordinates[1],
    ],
    isLocked: canvas.locked,
    eventId: canvas.event_id,
  };
}

/**
 * Retrieves a canvas from the cache using the default canvas ID defined in the database.
 *
 * @returns A tuple containing the id of the canvas and the cached canvas
 */
export async function getCurrentCanvas(): Promise<[number, CachedCanvas]> {
  const info = await prisma.info.findFirst({
    select: { default_canvas_id: true },
  });

  // To get rid of the nullable type from info. This should never happen
  if (!info) {
    throw new Error("The info table is empty! 😱");
  }

  const defaultCanvasId = info.default_canvas_id;
  const cachedCanvas = await getCanvasPng(defaultCanvasId);

  return [defaultCanvasId, cachedCanvas];
}

/**
 * Retrieves a canvas from the cache. If the canvas is not in the cache it will be fetched from the
 * database and added to it.
 *
 * @param canvasId The ID of the canvas to retrieve
 * @returns The cached canvas
 */
export async function getCanvasPng(canvasId: number): Promise<CachedCanvas> {
  if (!CANVAS_CACHE[canvasId]) {
    console.debug(`Cache miss for canvas ${canvasId}`);
    return getAndCacheCanvas(canvasId);
  }

  console.debug(`Cache hit for canvas ${canvasId}`);
  return CANVAS_CACHE[canvasId];
}

/**
 * Updates a pixel in the canvas cache. If the canvas is not in the cache, or the canvas is locked
 * this will do nothing.
 *
 * @param canvasId The ID of the canvas to update
 * @param x The x coordinate of the pixel
 * @param y The y coordinate of the pixel
 * @param color The color of the pixel
 */
export function updateCachedCanvasPixel(
  canvasId: CanvasInfo["id"],
  x: number,
  y: number,
  color: PixelColor,
): void {
  const cachedCanvas = CANVAS_CACHE[canvasId];

  if (!cachedCanvas || cachedCanvas.isLocked) {
    return;
  }

  const pixelIndex = y * cachedCanvas.width + x;
  cachedCanvas.pixels[pixelIndex] = color;
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

function saveCanvasToFileSystem(canvas: canvas, pixels: PixelColor[]): string {
  const filename = getCanvasFilename(canvas.id, canvas.locked);
  const path = `${config.paths.canvases}/${filename}`;

  pixelsToPng(canvas.width, canvas.height, pixels)
    .pack()
    .pipe(fs.createWriteStream(path));

  return path;
}

async function getAndCacheCanvas(canvasId: number): Promise<CachedCanvas> {
  const canvas = await prisma.canvas.findFirst({
    where: { id: canvasId },
  });

  if (!canvas) {
    throw new NotFoundError(`There is no canvas with ID ${canvasId}`);
  }

  const pixels = await getCanvasPixels(canvas);
  const unlockedCanvas: UnlockedCanvas = {
    isLocked: false,
    width: canvas.width,
    height: canvas.height,
    pixels,
  };

  if (canvas.locked) {
    const path = saveCanvasToFileSystem(canvas, pixels);
    CANVAS_CACHE[canvasId] = {
      isLocked: true,
      canvasPath: path,
    };

    console.debug(`Canvas ${canvasId} saved to ${path}`);
  } else {
    CANVAS_CACHE[canvasId] = unlockedCanvas;
    console.debug(`Canvas ${canvasId} cached in memory`);
  }

  // We always want to return the unlocked canvas, even if the image is locked as sometimes the
  // image hasn’t finished being written to the file system when Express tries to send it in the
  // response.
  return unlockedCanvas;
}
