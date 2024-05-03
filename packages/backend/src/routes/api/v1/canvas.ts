import { ApiError } from "@/errors";
import { parseCanvasId } from "@/models/paramModels";
import {
  CachedCanvas,
  getCanvasFilename,
  getCanvasPng,
  getCurrentCanvas,
  unlockedCanvasToPng,
} from "@/services/canvasService";
import { Response, Router } from "express";
import { pixelRouter } from "./pixel";

export const canvasRouter = Router();

canvasRouter.use("/:canvasId/pixel", pixelRouter);

canvasRouter.get("/current", async (req, res) => {
  try {
    const [canvasId, cachedCanvas] = await getCurrentCanvas();
    sendCachedCanvas(res, canvasId, cachedCanvas);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});

canvasRouter.get("/:canvasId", async (req, res) => {
  try {
    const canvasId = await parseCanvasId(req.params);
    const cachedCanvas = await getCanvasPng(canvasId);

    sendCachedCanvas(res, canvasId, cachedCanvas);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});

/**
 * Handles sending a cached canvas as a response.
 */
function sendCachedCanvas(
  res: Response,
  canvasId: number,
  cachedCanvas: CachedCanvas,
): void {
  if (cachedCanvas.isLocked) {
    res.sendFile(cachedCanvas.canvasPath);
    return;
  }

  const filename = getCanvasFilename(canvasId);

  unlockedCanvasToPng(cachedCanvas)
    .pack()
    .pipe(
      res
        .status(200)
        .type("png")
        .setHeader("Cache-Control", "no-cache no-store")
        .setHeader("Content-Disposition", `inline; filename="${filename}"`),
    );
}
