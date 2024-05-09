import z from "zod";

export const PlacePixelBodyModel = z.object({
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
  colorId: z.number().int().nonnegative(),
});

export const PlacePixelArrayBodyModel = z.array(
  z.object({
    x: z.number().int().nonnegative(),
    y: z.number().int().nonnegative(),
    rgba: z.array(z.number().int().nonnegative().max(255)).length(4),
  }),
);

export type PlacePixelArray = z.infer<typeof PlacePixelArrayBodyModel>;
