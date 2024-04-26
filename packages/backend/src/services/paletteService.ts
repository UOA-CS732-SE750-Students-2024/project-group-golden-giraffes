import { prisma } from "@/client";

export async function getPaletteForEvent(eventId: number): Promise<void> {
  const test = prisma.color.findUniqueOrThrow();
}
