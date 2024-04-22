import { Router } from "express";
import config from "../../../config";
import {
  canvasPixelsToPng,
  getCanvasFilename,
  getCanvasPng,
} from "../../../services/canvasService";
import { CanvasIdParamModel } from "../../../models/paramModels";

export const canvasRouter = Router();

canvasRouter.get("/", async (req, res) => {
  console.log(config.paths.canvases);
  res.status(200).json({ message: "Hello, World!" });
});

canvasRouter.get("/:canvasId", async (req, res) => {
  const result = await CanvasIdParamModel.safeParseAsync(req.params);
  if (!result.success) {
    res.status(400).json({ message: 'The provided canvasId is not valid', errors: result.error.issues });
    return;
  }

  const { canvasId } = result.data;
  const cachedCanvas = await getCanvasPng(canvasId);

  if (!cachedCanvas) {
    // TODO: Create error handling middleware
    return res.status(404).json({ message: "Canvas not found" });
  }

  const filename = getCanvasFilename(canvasId);

  if (cachedCanvas.isLocked) {
    res.sendFile(cachedCanvas.canvasPath);
    return;
  }

  canvasPixelsToPng(cachedCanvas)
    .pack()
    .pipe(
      res
        .status(200)
        .setHeader("Content-Type", "image/png")
        .setHeader("Content-Disposition", `inline; filename="${filename}"`),
    );
});
