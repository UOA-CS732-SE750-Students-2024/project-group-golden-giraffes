import { Router } from "express";

import { ApiError } from "@/errors";
import { getCurrentEvent } from "@/services/eventService";

export const eventRouter = Router();

eventRouter.get("/current", async (req, res) => {
  try {
    const event = await getCurrentEvent();
    res.status(200).json(event);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});
