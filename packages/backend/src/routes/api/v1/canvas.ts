import { Router } from "express";
import { canvasPixelsToPng, getCanvasFilename, getCanvasPng } from "../../../services/canvasService";
import config from "../../../config";

export const canvasRouter = Router();

canvasRouter.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

canvasRouter.get("/:canvasId", async (req, res) => {
  // TODO: Validate that the canvasId is a number
  const canvasId = Number.parseInt(req.params.canvasId);
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
