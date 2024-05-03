import { ApiError } from "@/errors";
import { parseCanvasId } from "@/models/paramModels";
import { getLeaderboard } from "@/services/statisticsService";
import { Router } from "express";

export const statisticsRouter = Router();

statisticsRouter.get("/leaderboard/:canvasId", async (req, res) => {
  try {
    const canvasId = await parseCanvasId(req.params);
    const leaderboard = await getLeaderboard(canvasId);
    return res.status(200).json(leaderboard);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});
