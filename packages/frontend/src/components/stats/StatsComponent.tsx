"use client";

import React, { useState, useEffect } from "react";

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
}

interface UserStats {
  // Placeholder for now
  user_id: string;
  canvas_id: number;
  total_pixels: number;
  rank: number;
  most_frequent_color_id: number;
  place_frequency: string;
  most_recent_timestamp: string;
}

const UserStatsComponent: React.FC<UserStatsComponentProps> = ({ userId }) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    // Dummy function to retrieve user stats
    const fetchUserStats = async () => {
      // const response = await fetch(`/api/user/${userId}/stats`);
      // const data = await response.json();
      // setStats(data);
      setStats({
        user_id: userId,
        canvas_id: 2024,
        total_pixels: 1000,
        rank: 1,
        most_frequent_color_id: 1,
        place_frequency: "1 day 00:00:00",
        most_recent_timestamp: "2023-05-13 06:41:37",
      });
    };

    fetchUserStats();
  }, [userId]);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <IndividualStat
        label="Total Pixels Placed"
        value={`${stats.total_pixels} pixels`}
      />
      <IndividualStat
        label="Leaderboard Ranking"
        value={`${stats.rank}${getOrdinalSuffix(stats.rank)}`}
      />
      <IndividualStat
        label="Most Frequent Color ID"
        value={stats.most_frequent_color_id}
      />
      <IndividualStat
        label="Place Frequency"
        value={formatInterval(stats.place_frequency)}
      />
      <IndividualStat
        label="Most Recent Pixel"
        value={formatTimestampLocalTZ(stats.most_recent_timestamp)}
        tooltip={formatTimestamp(stats.most_recent_timestamp)}
      />
    </div>
  );
};

export default UserStatsComponent;

const IndividualStat: React.FC<{
  label: string;
  value: string | number;
  tooltip?: string;
}> = ({ label, value, tooltip }) => (
  <div>
    <h3>{label}</h3>
    <span title={tooltip}>
      <p>{value}</p>
    </span>
  </div>
);
