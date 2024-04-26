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
        // Only include the participation for the event we're looking at
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

  // TODO: Map the eventPalette to a PaletteDto
  return {} as PaletteDto;
}
