import { prisma } from "@/client";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/errors";
import {
  seedCanvases,
  seedGuilds,
  seedHistory,
  seedPixels,
  seedUsers,
} from "@/test";
import { getLeaderboard, getUserStats } from "./statisticsService";

describe("Statistics Service Tests", () => {
  beforeEach(() => {
    seedCanvases();
    seedUsers();
    seedPixels();
    seedHistory();
    seedGuilds();
  });

  it("Gets the leaderboard", async () => {
    const leaderboard = await getLeaderboard(2);
    expect(leaderboard).toHaveLength(20);
  });

  it("Gets user stats", async () => {
    const stats = await getUserStats("1", 2);
    expect(stats).not.toBeNull();
  });
});
