import { prisma } from "@/client";

// Only use 2 canvases for testing purposes
export const testCanvas = {
  width: 2,
  height: 2,
  start_coordinates: [1, 1],
  cooldown_length: 30,
};

export default function intializeCanvases() {
  prisma.canvas.create({
    data: {
      ...testCanvas,
      id: 1,
      name: "Unlocked Canvas",
      locked: false,
      event_id: 1,
    },
  });
  prisma.canvas.create({
    data: {
      ...testCanvas,
      id: 9,
      name: "Locked Canvas",
      locked: true,
      event_id: 9,
    },
  });
}
