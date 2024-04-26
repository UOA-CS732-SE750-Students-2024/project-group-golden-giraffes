import { prisma } from "@/client";
import { PaletteColor } from "@blurple-canvas-web/types";

export async function getPaletteForEvent(
  eventId: number,
): Promise<PaletteColor[]> {
  const eventPalette = await prisma.color.findMany({
    select: {
      id: true,
      code: true,
      global: true,
      name: true,
      rgba: true,
      participations: {
        select: {
          guild: { select: { invite: true } }, // Include the guild invite
        },
        // Only include the participation for the event we're looking at. This way the only element
        // in the participations array will be the one for the event we're looking at.
        where: {
          event_id: eventId,
        },
      },
    },
    // Filter the colours to only include global colours or colours that are part of the event
    where: {
      OR: [
        { global: true },
        {
          participations: { some: { event_id: eventId } },
        },
      ],
    },
  });

  return eventPalette.map((color) => ({
    id: color.id,
    code: color.code,
    name: color.name,
    rgba: color.rgba,
    global: color.global,
    // We don't need to worry about the size of participations because JS doesn't throw index out
    // of bounds errors, instead it just returns undefined.
    invite: color.participations[0]?.guild?.invite ?? null,
  }));
}
