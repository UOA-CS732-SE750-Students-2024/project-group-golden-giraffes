import { Router } from "express";

import { ApiError } from "@/errors";
import { getCurrentEvent, getEventById } from "@/services/eventService";

export const eventRouter = Router();

eventRouter.get("/:eventId", async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await getEventById(Number.parseInt(eventId));
    res.status(200).json(event);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});

eventRouter.get("/current", async (req, res) => {
  try {
    const event = await getCurrentEvent();
    res.status(200).json(event);
  } catch (error) {
    ApiError.sendError(res, error);
  }
});
