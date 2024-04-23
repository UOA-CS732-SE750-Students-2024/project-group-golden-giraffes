import { Router } from "express";
import { CanvasIdParamModel } from "@/models/paramModels";
import {
  unlockedCanvasToPng,
  getCanvasFilename,
  getCanvasPng,
} from "@/services/canvasService";
import ApiError from "@/errors/ApiError";

export const canvasRouter = Router();

canvasRouter.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
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

    if (!cachedCanvas) {
      res
        .status(404)
        .json({ message: `There is no canvas with ID ${canvasId}` });
      return;
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
          .type("png")
          .setHeader("Content-Disposition", `inline; filename="${filename}"`),
      );
  } catch (error) {
    ApiError.handleError(res, error);
  }
});
