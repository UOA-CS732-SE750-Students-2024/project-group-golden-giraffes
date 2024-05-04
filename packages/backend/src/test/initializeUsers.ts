import { prisma } from "@/client";

export default function initialiseUsers() {
  prisma.user.createMany({
    data: [{ id: BigInt(1) }, { id: BigInt(9) }],
  });
}
