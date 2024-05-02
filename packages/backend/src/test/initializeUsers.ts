import { prisma } from "@/client";

export default function initialiseUsers() {
  prisma.user.createMany({
    data: [{ id: 1 }, { id: 9 }],
  });
}
