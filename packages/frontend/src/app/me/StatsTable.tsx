"use client";

import { styled } from "@mui/material";

import { getOrdinalSuffix } from "@/util";
import { UserStats } from "@blurple-canvas-web/types";

const EmptyStateMessage = styled("div")`
  border-radius: var(--card-border-radius);
  background-color: var(--discord-legacy-not-quite-black);
  padding: 1rem;
`;

const Table = styled("table")`
  margin-block-start: 1rem;

  th,
  td {
    padding: 0.5rem;
  }

  th {
    font-weight: 600;
    text-align: start;
  }

  td {
    text-align: end;
  }
`;

interface StatsTableProps {
  stats?: UserStats;
  statsAreLoading: boolean;
}

export default function StatsTable({
  stats,
  statsAreLoading,
}: StatsTableProps) {
  if (!stats) return <EmptyStateMessage>No stats!</EmptyStateMessage>;

  const { totalPixels, mostFrequentColor, mostRecentTimestamp, rank } = stats;

  return (
    <Table>
      <tbody>
        <tr>
          <th>{totalPixels ?? "?"}&nbsp;pixels placed</th>
          <td>
            {statsAreLoading ?
              "Loading…"
            : rank && `${rank}${getOrdinalSuffix(rank)}`}
          </td>
        </tr>
        <tr>
          <th>Most used color</th>
          <td>
            {statsAreLoading ?
              "Loading…"
            : mostFrequentColor?.name ?? "Unknown"}
          </td>
        </tr>
        <tr>
          <th>Most recently placed</th>
          <td>
            {statsAreLoading ? "Loading…" : mostRecentTimestamp ?? "Unknown"}
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
