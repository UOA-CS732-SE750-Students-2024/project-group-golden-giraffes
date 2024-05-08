// "use client";

// import config from "@/config";
// import { UserStats } from "@blurple-canvas-web/types";
// import { DateTime } from "luxon";
// import React, { useState, useEffect, ReactNode } from "react";
// import { PaletteColorRecord } from "../color/Color";

// interface UserStatsComponentProps {
//   userId: string;
//   canvasId: number;
// }

// export default function UserStatsComponent({
//   userId,
//   canvasId,
// }: UserStatsComponentProps) {
//   const [stats, setStats] = useState<UserStats | null>(null);

//   useEffect(() => {
//     const fetchUserStats = async () => {
//       const response = await fetch(
//         `${config.apiUrl}/api/v1/statistics/user/${userId}/${canvasId}`,
//       );
//       const data = await response.json();
//       setStats(data);
//     };

//     fetchUserStats();
//   }, [userId, canvasId]);

//   if (!stats) {
//     return <div>Loading…</div>;
//   }

//   return (
//     <div>
//       <IndividualStat
//         label="Total Pixels Placed"
//         value={`${stats.totalPixels} pixels`}
//       />
//       {stats.rank && (
//         <IndividualStat
//           label="Leaderboard Ranking"
//           value={`${stats.rank}${getOrdinalSuffix(stats.rank)}`}
//         />
//       )}
//       {stats.mostFrequentColor && (
//         <IndividualStat
//           label="Most Frequent Color ID"
//           value={<PaletteColorRecord color={stats.mostFrequentColor} />}
//           tooltip={stats.mostFrequentColor.code}
//         />
//       )}
//       {/* {stats.placeFrequency && (
//         <IndividualStat
//           label="Place Frequency"
//           value={formatInterval(stats.placeFrequency)}
//         />
//       )} */}
//       {stats.mostRecentTimestamp && (
//         <IndividualStat
//           label="Most Recent Pixel"
//           value={formatTimestampLocalTZ(stats.mostRecentTimestamp)}
//           tooltip={formatTimestamp(stats.mostRecentTimestamp)}
//         />
//       )}
//     </div>
//   );
// }

// const IndividualStat = ({
//   label,
//   value,
//   tooltip,
// }: {
//   label: string;
//   value: ReactNode;
//   tooltip?: string;
// }): ReactNode => {
//   return (
//     <div>
//       <h3>{label}</h3>
//       <span title={tooltip}>{value}</span>
//     </div>
//   );
// };
