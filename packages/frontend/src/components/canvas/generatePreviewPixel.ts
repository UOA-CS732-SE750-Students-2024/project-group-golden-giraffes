import { PixelInfo } from "@blurple-canvas-web/types";

/**
 * Generate a PNG image with a pixel at a specific location.
 * @param width Width of the canvas.
 * @param height Height of the canvas.
 * @param pixelX X coordinate of the pixel.
 * @param pixelY Y coordinate of the pixel.
 * @returns Image data of the generated PNG image.
 */
export default function generatePixelPng(
  width: number | undefined,
  height: number | undefined,
  pixelInfo: PixelInfo,
): ImageData {
  if (!width || !height) {
    throw new Error("Width and height must be provided.");
  }
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) throw new Error("Canvas context is not available.");

  tempCanvas.width = width;
  tempCanvas.height = height;

  tempCtx.fillStyle = "white";
  tempCtx.fillRect(pixelInfo.x, pixelInfo.y, 1, 1);

  const imageData = tempCtx.getImageData(0, 0, width, height);

  tempCanvas.remove();

  return imageData;
}
