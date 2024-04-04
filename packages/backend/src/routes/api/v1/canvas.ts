import { Router } from "express";
import { prisma } from "../../../client";
import { canvasToPng } from "../../../services/canvasService";

export const canvasRouter = Router();

canvasRouter.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

canvasRouter.get("/:canvasId", async (req, res) => {
  // TODO: Validate that the canvasId is a number

  const canvas = await prisma.canvas.findFirst({
    where: { id: Number.parseInt(req.params.canvasId) },
  });

  console.log(canvas);

  if (!canvas) {
    // TODO: Create error handling middleware
    return res.status(404).json({ message: "Canvas not found" });
  }

  const png = await canvasToPng(canvas);
  png.pack().pipe(res.status(200).setHeader("Content-Type", "image/png"));
});
