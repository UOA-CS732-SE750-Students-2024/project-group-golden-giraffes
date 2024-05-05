import BadRequestError from "@/errors/BadRequestError";
import z from "zod";

const CanvasIdParamModel = z.object({
  canvasId: z.coerce.number().int().positive(),
});

export const EventIdParamModel = z.object({
  eventId: z.coerce.number().int().positive(),
});

export const PixelHistoryParamModel = z.object({
  x: z.coerce.number().int().min(0),
  y: z.coerce.number().int().min(0),
});

export interface CanvasIdParam {
  canvasId: string;
}

export async function parseCanvasId(params: CanvasIdParam): Promise<number> {
  const result = await CanvasIdParamModel.safeParseAsync(params);
  if (!result.success) {
    throw new BadRequestError(
      `${params.canvasId} is not a valid canvas ID`,
      result.error.issues,
    );
  }

  return result.data.canvasId;
}
