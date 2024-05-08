"use client";

import { useLeaderboard } from "@/hooks/queries/useLeaderboard";
import { CanvasInfo } from "@blurple-canvas-web/types";

export interface LeaderboardProps {
  canvasId: CanvasInfo["id"];
}

export default function Leaderboard() {
  const canvasId = 2023; // change later
  const { data: leaderboard = [] } = useLeaderboard(canvasId);

  return (
    <div>
      {leaderboard.map((entry) => (
        <div key={entry.userId}>
          <div>
            <img
              src={entry.profilePictureUrl}
              alt={`User ${entry.username}'s avatar`}
            />
            <p>{entry.rank}</p>
            <p>{entry.username}</p>
            <p>{entry.totalPixels}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
