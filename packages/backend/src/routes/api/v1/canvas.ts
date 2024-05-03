import { ApiError } from "@/errors";
import { parseCanvasId } from "@/models/paramModels";
import {
  CachedCanvas,
  getCanvasFilename,
  getCanvasInfo,
  getCanvasPng,
  getCanvases,
  getCurrentCanvas,
  getCurrentCanvasInfo,
  unlockedCanvasToPng,
} from "@/services/canvasService";
import { Response, Router } from "express";
import { pixelRouter } from "./pixel";

export const canvasRouter = Router();

canvasRouter.use("/:canvasId/pixel", pixelRouter);

canvasRouter.get("/", async (req, res) => {
  try {
    const canvases = await getCanvases();
    return res.status(200).json(canvases);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});

canvasRouter.get("/current/info", async (req, res) => {
  try {
    const canvasInfo = await getCurrentCanvasInfo();
    return res.status(200).json(canvasInfo);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});

canvasRouter.get("/:canvasId/info", async (req, res) => {
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
    const canvasInfo = await getCanvasInfo(canvasId);

    return res.status(200).json(canvasInfo);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});

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
