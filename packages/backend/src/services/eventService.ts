import { prisma } from "@/client";
import { NotFoundError } from "@/errors";
import { BlurpleEvent } from "@blurple-canvas-web/types";

export async function getCurrentEvent(): Promise<BlurpleEvent> {
  const info = await prisma.info.findFirst({
    select: {
      current_event: true,
    },
  });

  if (!info) {
    throw new Error("The info table is empty! 😱");
  }

  const { current_event: currentEvent } = info;

  if (!currentEvent) {
    // The `current_event_id` value is not a valid ID in the `event` table
    throw new NotFoundError("Can’t find the current event");
  }

  return currentEvent;
}
