"use client";

import { LayoutWithNavbar } from "@/components";
import Leaderboard from "@/components/stats/Leaderboard";

export default function LeaderboardPage() {
  return <LayoutWithNavbar content={<Leaderboard />} />;
}
