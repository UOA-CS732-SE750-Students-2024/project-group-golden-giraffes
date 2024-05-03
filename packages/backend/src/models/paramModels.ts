import z from "zod";

export const CanvasIdParamModel = z.object({
  canvasId: z.coerce.number().int().positive(),
});

export const EventIdParamModel = z.object({
  eventId: z.coerce.number().int().positive(),
});

export const PixelHistoryParamModel = z.object({
  x: z.coerce.number().int().positive(),
  y: z.coerce.number().int().positive(),
});

export type CanvasIdParam = z.infer<typeof CanvasIdParamModel>;
