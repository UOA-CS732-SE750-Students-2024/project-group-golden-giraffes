"use client";

import config from "@/config";
import { UserStats } from "@blurple-canvas-web/types";
import { DateTime } from "luxon";
import React, { useState, useEffect, ReactNode } from "react";
import { Color } from "../color/Color";

function getOrdinalSuffix(rank: number) {
  const trailingDigits = rank % 100;
  if (11 <= trailingDigits && trailingDigits <= 13) {
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

function formatInterval(interval: string) {
  const [daysStr, time] = interval.split(" ");
  const days = Number.parseInt(daysStr);
  const [hours, minutes, seconds] = time
    .split(":")
    .map((num) => Number.parseInt(num));
  const components = [];
  if (days > 0) components.push(`${days} ${days === 1 ? "day" : "days"}`);
  if (hours > 0) components.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes > 0)
    components.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  if (seconds > 0)
    components.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);
  return components.join("");
}

function formatTimestamp(timestamp: string, utc = true) {
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return dateToString(date, utc);
}

function formatTimestampLocalTZ(timestamp: string) {
  return formatTimestamp(timestamp, false);
}

function dateToString(date: Date, utc?: boolean) {
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
      <span title={tooltip}>{value}</span>
    </div>
  );
};
