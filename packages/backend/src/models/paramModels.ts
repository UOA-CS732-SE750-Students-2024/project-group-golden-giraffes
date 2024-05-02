import z from "zod";

export const CanvasIdParamModel = z.object({
  canvasId: z.coerce.number().int().positive(),
});

export const EventIdParamModel = z.object({
  eventId: z.coerce.number().int().positive(),
});
