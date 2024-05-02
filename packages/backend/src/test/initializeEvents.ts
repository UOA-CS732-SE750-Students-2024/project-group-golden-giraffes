import { prisma } from "@/client";

export default function () {
  prisma.event.createMany({
    data: [
      { id: 1, name: "Current Event" },
      { id: 9, name: "Past Event" },
    ],
  });
}
