import { prisma } from "@/client";
import { PrismockClientType } from "prismock/build/main/lib/client";

vi.mock("@prisma/client", async () => {
  const prismock = await vi.importActual("prismock");
  return {
    ...vi.importActual("@prisma/client"),
    PrismaClient: prismock.PrismockClient,
  };
});

afterEach(() => {
  const prismock = prisma as PrismockClientType;
  prismock.reset();
});
