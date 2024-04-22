import { Router } from "express";
import { getCanvasFilename, getCanvasPng } from "../../../services/canvasService";

export const canvasRouter = Router();

canvasRouter.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

canvasRouter.get("/:canvasId", async (req, res) => {
  // TODO: Validate that the canvasId is a number
  const canvasId = Number.parseInt(req.params.canvasId);
  const png = await getCanvasPng(canvasId);

  if (!png) {
    // TODO: Create error handling middleware
    return res.status(404).json({ message: "Canvas not found" });
  }

  const filename = getCanvasFilename(canvasId);

  png
    .pack()
    .pipe(
      res
        .status(200)
        .setHeader("Content-Type", "image/png")
        .setHeader("Content-Disposition", `inline; filename="${filename}"`),
    );
});
