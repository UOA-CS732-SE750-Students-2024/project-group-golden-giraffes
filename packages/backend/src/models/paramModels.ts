import BadRequestError from "@/errors/BadRequestError";
import { CanvasInfo } from "@blurple-canvas-web/types";
import z from "zod";

const CanvasIdParamModel = z.object({
  canvasId: z.coerce.number().int().positive(),
});

export const EventIdParamModel = z.object({
  eventId: z.coerce.number().int().positive(),
});

export type LeaderboardParamModel = typeof CanvasIdParamModel;

export const LeaderboardQueryModel = z.object({
  size: z.coerce.number().int().positive().optional(),
});

export const PixelHistoryParamModel = z.object({
  x: z.coerce.number().int().nonnegative(),
  y: z.coerce.number().int().nonnegative(),
});

export interface CanvasIdParam {
  canvasId: string;
  [key: string]: string;
}

export async function parseCanvasId(
  params: CanvasIdParam,
): Promise<CanvasInfo["id"]> {
  const result = await CanvasIdParamModel.safeParseAsync(params);
  if (!result.success) {
    throw new BadRequestError(
      `${params.canvasId} is not a valid canvas ID`,
      result.error.issues,
    );
  }

  return result.data.canvasId;
}
