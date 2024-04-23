import { Router } from "express";
import { CanvasIdParamModel } from "../../../models/paramModels";
import {
  unlockedCanvasToPng,
  getCanvasFilename,
  getCanvasPng,
} from "../../../services/canvasService";

export const canvasRouter = Router();

canvasRouter.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

canvasRouter.get("/:canvasId", async (req, res) => {
  const result = await CanvasIdParamModel.safeParseAsync(req.params);
  if (!result.success) {
    res.status(400).json({
      message: "The canvasId is not valid",
      errors: result.error.issues,
    });
    return;
  }

  const { canvasId } = result.data;
  const cachedCanvas = await getCanvasPng(canvasId);

  if (!cachedCanvas) {
    return res
      .status(404)
      .json({ message: `There is no canvas with ID ${canvasId}` });
  }

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
        .setHeader("Content-Type", "image/png")
        .setHeader("Content-Disposition", `inline; filename="${filename}"`),
    );
});
