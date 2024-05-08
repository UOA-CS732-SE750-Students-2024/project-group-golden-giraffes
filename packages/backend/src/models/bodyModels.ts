import z from "zod";

export const PlacePixelBodyModel = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  colorId: z.number().int().min(0),
});

export const PlacePixelArrayBodyModel = z.array(PlacePixelBodyModel);
