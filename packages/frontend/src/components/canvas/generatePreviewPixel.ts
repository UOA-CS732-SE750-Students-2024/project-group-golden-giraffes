import { PaletteColor, Point } from "@blurple-canvas-web/types";
import { RefObject } from "react";

/**
 * Generate a PNG image with a pixel at a specific location.
 * @param canvasRef Reference to the canvas element.
 * @param pixelX X coordinate of the pixel.
 * @param pixelY Y coordinate of the pixel.
 */
export default function updateCanvasPreviewPixel(
  canvasRef: RefObject<HTMLCanvasElement>,
  pixelPoint: Point,
  color: PaletteColor | null,
) {
  const context = canvasRef.current?.getContext("2d");
  if (!context) {
    throw new Error("Canvas context is null");
  }

  const { width, height } = context.canvas;

  const { x, y } = pixelPoint;

  // clear the canvas
  context.clearRect(0, 0, width, height);

  // draw a 5x5 white square around the pixel
  context.fillStyle = "white";
  context.fillRect(x - 6, y - 6, 13, 13);

  // draw a 3x3 black square around the pixel
  context.fillStyle = "black";
  context.fillRect(x - 3, y - 3, 7, 7);

  // clear quadrants to make a cross
  context.clearRect(x - 6, y - 6, 6, 6);
  context.clearRect(x + 1, y - 6, 6, 6);
  context.clearRect(x - 6, y + 1, 6, 6);
  context.clearRect(x + 1, y + 1, 6, 6);

  context.clearRect(x - 2, y - 2, 5, 5);

  if (color) {
    context.fillStyle = `rgb(${color.rgba.join()})`;
    context.fillRect(x, y, 1, 1);
  }
}
