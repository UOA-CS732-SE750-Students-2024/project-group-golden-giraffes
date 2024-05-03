import { prisma } from "@/client";
import { PrismockClientType } from "prismock/build/main/lib/client";

jest.mock("@prisma/client", () => {
  return {
    ...jest.requireActual("@prisma/client"),
    PrismaClient: jest.requireActual("prismock").PrismockClient,
  };
});

afterEach(() => {
  const prismock = prisma as PrismockClientType;
  prismock.reset();
});
