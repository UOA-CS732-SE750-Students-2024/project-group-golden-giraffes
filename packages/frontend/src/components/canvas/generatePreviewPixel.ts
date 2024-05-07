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

  const x = pixelInfo.x;
  const y = pixelInfo.y;

  // draw a 5x5 white square around the pixel
  tempCtx.fillStyle = "white";
  tempCtx.fillRect(x - 6, y - 6, 13, 13);

  // draw a 3x3 black square around the pixel
  tempCtx.fillStyle = "black";
  tempCtx.fillRect(x - 3, y - 3, 7, 7);

  // clear quadrants to make a cross
  tempCtx.clearRect(x - 6, y - 6, 6, 6);
  tempCtx.clearRect(x + 1, y - 6, 6, 6);
  tempCtx.clearRect(x - 6, y + 1, 6, 6);
  tempCtx.clearRect(x + 1, y + 1, 6, 6);

  tempCtx.clearRect(x - 2, y - 2, 5, 5);

  tempCtx.fillStyle = "white";
  tempCtx.fillRect(x, y, 1, 1);

  const imageData = tempCtx.getImageData(0, 0, width, height);

  tempCanvas.remove();

  return imageData;
}
