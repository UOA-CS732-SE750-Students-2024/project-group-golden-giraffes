import LayoutWithNavbar from "@/components/LayoutWithNavbar";
import Leaderboard from "@/components/stats/Leaderboard";

export default function LeaderboardPage() {
  return <LayoutWithNavbar content={<Leaderboard />} />;
}
