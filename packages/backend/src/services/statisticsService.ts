import { prisma } from "@/client";
import { LeaderboardRow } from "@blurple-canvas-web/types";
/**
 * Retrieves the top 20 users on the leaderboard for a canvas.
 *
 * @returns The top 20 users on the leaderboard for a canvas.
 */
export async function getLeaderboard(
  canvasId: number,
): Promise<LeaderboardRow[]> {
  const leaderboard = await prisma.leaderboard.findMany({
    take: 20,
    // prisma doesn't seem to be preserving the order of the leaderboard view
    orderBy: {
      rank: "asc",
    },
    where: {
      canvas_id: canvasId,
    },
    select: {
      rank: true,
      user_id: true,
      canvas_id: true,
      total_pixels: true,
    },
  });

  return leaderboard.map((row) => ({
    rank: row.rank,
    userId: row.user_id,
    canvasId: row.canvas_id,
    totalPixels: row.total_pixels,
  }));
}
