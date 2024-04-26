import { prisma } from "@/client";
import { PaletteColor } from "@blurple-canvas-web/types";

/**
 * Retrieves the palette for the current event defined in the database.
 *
 * @returns The palette for the current event
 */
export async function getCurrentEventPalette(): Promise<PaletteColor[]> {
  const info = await prisma.info.findFirst({
    select: { current_event_id: true },
  });

  // To get rid of the nullable type from info. This should never happen
  if (!info) {
    throw new Error("The info table is empty! 😱");
  }

  const currentEventId = info.current_event_id;
  return await getEventPalette(currentEventId);
}

/**
 * Retrieves the palette for an event. This includes all global colors and the partner colors for
 * the specific event. If there is not event with the given ID, only the global colors will be
 * returned.
 *
 * @param eventId The ID of the event to get the palette for
 * @returns The palette for the event
 */
export async function getEventPalette(
  eventId: number,
): Promise<PaletteColor[]> {
  console.debug(`Getting palette for event ${eventId}`);
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
