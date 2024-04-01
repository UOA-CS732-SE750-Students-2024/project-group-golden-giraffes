import { Router } from "express";

export const canvasRouter = Router();

canvasRouter.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

canvasRouter.get("/:canvasId", async (req, res) => {
  // TODO: Validate that the canvasId is a number
});
