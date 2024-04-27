import { ApiError } from "@/errors";
import { CanvasIdParamModel } from "@/models/paramModels";
import {
  CachedCanvas,
  getCanvasFilename,
  getCanvasPng,
  getCurrentCanvas,
  unlockedCanvasToPng,
} from "@/services/canvasService";
import { Response, Router } from "express";

export const canvasRouter = Router();

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
    const result = await CanvasIdParamModel.safeParseAsync(req.params);
    if (!result.success) {
      res.status(400).json({
        message: `${req.params.canvasId} is not a valid canvas ID`,
        errors: result.error.issues,
      });
      return;
    }

    const { canvasId } = result.data;
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
        .setHeader("Content-Disposition", `inline; filename="${filename}"`),
    );
}
