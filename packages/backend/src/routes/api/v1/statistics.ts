import { ApiError } from "@/errors";
import { CanvasIdParamModel } from "@/models/paramModels";
import { getLeaderboard } from "@/services/statisticsService";
import { Response, Router } from "express";

export const statisticsRouter = Router();

statisticsRouter.get("/leaderboard/:canvasId", async (req, res) => {
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
    const leaderboard = await getLeaderboard(canvasId);
    return res.status(200).json(leaderboard);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});
