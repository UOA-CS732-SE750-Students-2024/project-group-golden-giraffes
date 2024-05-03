"use client";

import config from "@/config";
import { PaletteColor, UserStats } from "@blurple-canvas-web/types";
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
  const [hours, minutes, seconds] = time.split(":");
  let formattedInterval = "";
  formattedInterval +=
    Number.parseInt(days) === 1 ? `${days} day `
    : Number.parseInt(days) > 1 ? `${days} days `
    : "";
  formattedInterval +=
    Number.parseInt(hours) === 1 ? `${hours} hour `
    : Number.parseInt(hours) > 1 ? `${hours} hours `
    : "";
  formattedInterval +=
    Number.parseInt(minutes) === 1 ? `${minutes} minute `
    : Number.parseInt(minutes) > 1 ? `${minutes} minutes `
    : "";
  formattedInterval +=
    Number.parseInt(seconds) === 1 ? `${seconds} second`
    : Number.parseInt(seconds) > 1 ? `${seconds} seconds`
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

function dateToString(date: Date, timezone?: boolean): string {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: timezone ? "UTC" : undefined,
    timeZoneName: timezone ? "short" : undefined,
  });
}

interface UserStatsComponentProps {
  userId: string;
  canvasId: number;
}

const UserStatsComponent: React.FC<UserStatsComponentProps> = ({
  userId,
  canvasId,
}) => {
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <IndividualStat
        label="Total Pixels Placed"
        value={`${stats.totalPixels} pixels`}
      />
      <IndividualStat
        label="Leaderboard Ranking"
        value={`${stats.rank}${getOrdinalSuffix(stats.rank)}`}
      />
      <IndividualStat
        label="Most Frequent Color ID"
        value={<Color color={stats.mostFrequentColor} />}
        tooltip={stats.mostFrequentColor.code}
      />
      {/* <IndividualStat
        label="Place Frequency"
        value={formatInterval(stats.placeFrequency)}
      /> */}
      <IndividualStat
        label="Most Recent Pixel"
        value={formatTimestampLocalTZ(stats.mostRecentTimestamp)}
        tooltip={formatTimestamp(stats.mostRecentTimestamp)}
      />
    </div>
  );
};

export default UserStatsComponent;

const IndividualStat: React.FC<{
  label: string;
  value: ReactNode;
  tooltip?: string;
}> = ({ label, value, tooltip }) => (
  <div>
    <h3>{label}</h3>
    <span title={tooltip}>
      <p>{value}</p>
    </span>
  </div>
);

const Color: React.FC<{ color: PaletteColor }> = (
  { color }, // This could probably be refactored to be somewhere else, and called whenever a color is needed to be displayed
) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <div
      style={{
        backgroundColor: `rgba(${color.rgba.toString()})`,
        width: "25px",
        height: "25px",
        marginRight: "5px",
        borderRadius: "15%",
      }}
    />
    {color.name}
  </div>
);
