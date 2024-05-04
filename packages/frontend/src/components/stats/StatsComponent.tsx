"use client";

import config from "@/config";
import { PaletteColor, UserStats } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";
import { DateTime } from "luxon";
import React, { useState, useEffect, ReactNode } from "react";

function getOrdinalSuffix(rank: number): string {
  if (rank % 100 >= 11 && rank % 100 <= 13) {
    return "th";
  }
  switch (rank % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatInterval(interval: string): string {
  const [days, time] = interval.split(" ");
  const [hours, minutes, seconds] = time
    .split(":")
    .map((num) => Number.parseInt(num));
  let formattedInterval = "";
  formattedInterval +=
    Number.parseInt(days) === 1 ? `${days} day `
    : Number.parseInt(days) > 1 ? `${days} days `
    : "";
  formattedInterval +=
    hours === 1 ? `${hours} hour `
    : hours > 1 ? `${hours} hours `
    : "";
  formattedInterval +=
    minutes === 1 ? `${minutes} minute `
    : minutes > 1 ? `${minutes} minutes `
    : "";
  formattedInterval +=
    seconds === 1 ? `${seconds} second`
    : seconds > 1 ? `${seconds} seconds`
    : "";
  return formattedInterval.trim();
}

function formatTimestamp(timestamp: string, utc = true): string {
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return dateToString(date, utc);
}

function formatTimestampLocalTZ(timestamp: string): string {
  return formatTimestamp(timestamp, false);
}

function dateToString(date: Date, utc?: boolean): string {
  let luxonDate = DateTime.fromJSDate(date);
  let format = DateTime.DATETIME_FULL;
  if (utc) {
    luxonDate = luxonDate.toUTC();
  } else {
    format = { ...format, timeZoneName: undefined };
  }
  return luxonDate.toLocaleString(format);
}

interface UserStatsComponentProps {
  userId: string;
  canvasId: number;
}

export default function UserStatsComponent({
  userId,
  canvasId,
}: UserStatsComponentProps) {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      const response = await fetch(
        `${config.apiUrl}/api/v1/statistics/user/${userId}/${canvasId}`,
      );
      const data = await response.json();
      setStats(data);
    };

    fetchUserStats();
  }, [userId, canvasId]);

  if (!stats) {
    return <div>Loading…</div>;
  }

  return (
    <div>
      <IndividualStat
        label="Total Pixels Placed"
        value={`${stats.totalPixels} pixels`}
      />
      {stats.rank && (
        <IndividualStat
          label="Leaderboard Ranking"
          value={`${stats.rank}${getOrdinalSuffix(stats.rank)}`}
        />
      )}
      {stats.mostFrequentColor && (
        <IndividualStat
          label="Most Frequent Color ID"
          value={<Color color={stats.mostFrequentColor} />}
          tooltip={stats.mostFrequentColor.code}
        />
      )}
      {/* {stats.placeFrequency && (
        <IndividualStat
          label="Place Frequency"
          value={formatInterval(stats.placeFrequency)}
        />
      )} */}
      {stats.mostRecentTimestamp && (
        <IndividualStat
          label="Most Recent Pixel"
          value={formatTimestampLocalTZ(stats.mostRecentTimestamp)}
          tooltip={formatTimestamp(stats.mostRecentTimestamp)}
        />
      )}
    </div>
  );
}

const IndividualStat = ({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: ReactNode;
  tooltip?: string;
}): ReactNode => {
  return (
    <div>
      <h3>{label}</h3>
      <span title={tooltip}>
        <p>{value}</p>
      </span>
    </div>
  );
};

const ColorContainer = styled("div")`
  display: flex;
  align-items: center;
`;

const ColorBox = styled("div")<{ rgba: number[] }>(
  ({ rgba }) => `
    background-color: rgba(${rgba.toString()});
    width: 25px;
    height: 25px;
    margin-right: 5px;
    border-radius: 15%;
  `,
);

const Color = ({ color }: { color: PaletteColor }): ReactNode => {
  return (
    <ColorContainer>
      <ColorBox rgba={color.rgba} />
      {color.name}
    </ColorContainer>
  );
};
