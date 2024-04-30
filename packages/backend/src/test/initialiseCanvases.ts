import { prisma } from "@/client";

// Only use 2 canvases for testing purposes
export const testCanvas = {
  width: 4,
  height: 4,
  start_coordinates: [1, 1],
  cooldown_length: 30,
};

export default function () {
  prisma.canvas.create({
    data: { ...testCanvas, name: "Unlocked Canvas", locked: false },
  });
  prisma.canvas.create({
    data: { ...testCanvas, name: "Locked Canvas", locked: true },
  });
}
