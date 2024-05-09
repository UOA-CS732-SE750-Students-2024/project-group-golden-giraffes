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

  if (color) {
    context.fillStyle = `rgb(${color.rgba.join()})`;
    context.fillRect(x, y, 1, 1);
  }
}
