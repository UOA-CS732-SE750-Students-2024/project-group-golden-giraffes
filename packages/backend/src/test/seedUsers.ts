import { prisma } from "@/client";

export default function () {
  prisma.user.createMany({
    data: [{ id: BigInt(1) }, { id: BigInt(9) }],
  });
}
