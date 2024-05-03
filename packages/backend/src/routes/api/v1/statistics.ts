import { ApiError } from "@/errors";
import { parseCanvasId } from "@/models/paramModels";
import { getLeaderboard, getUserStats } from "@/services/statisticsService";
import { Router } from "express";

export const statisticsRouter = Router();

statisticsRouter.get("/user/:userId/:canvasId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const canvasId = await parseCanvasId({ canvasId: req.params.canvasId });
    const stats = await getUserStats(userId, canvasId);
    return res.status(200).json(stats);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});

statisticsRouter.get("/leaderboard/:canvasId", async (req, res) => {
  try {
    const canvasId = await parseCanvasId(req.params);
    const leaderboard = await getLeaderboard(canvasId);
    return res.status(200).json(leaderboard);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});
