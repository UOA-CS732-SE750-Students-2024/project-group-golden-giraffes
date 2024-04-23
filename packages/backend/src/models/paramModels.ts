import z from "zod";

export const CanvasIdParamModel = z.object({
  canvasId: z.coerce.number().int().positive(),
});
