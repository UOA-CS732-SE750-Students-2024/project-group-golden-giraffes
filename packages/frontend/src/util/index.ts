import { DateTime, StringUnitLength } from "luxon";

import config from "@/config";
import { DiscordUserProfile, Point } from "@blurple-canvas-web/types";

/**
 * Return the value clamped so that it is within the range [min, max].
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getOrdinalSuffix(rank: number) {
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

export function formatInterval(interval: string) {
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

export function formatTimestamp(timestamp: string, utc = true) {
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return dateToString(date, utc);
}

export function formatTimestampLocalTZ(timestamp: string) {
  return formatTimestamp(timestamp, false);
}

export function dateToString(date: Date, utc?: boolean) {
  let luxonDate = DateTime.fromJSDate(date);
  let format = DateTime.DATETIME_FULL;
  if (utc) {
    luxonDate = luxonDate.toUTC();
  } else {
    format = { ...format, timeZoneName: undefined };
  }
  return luxonDate.toLocaleString(format);
}

export function decodeUserGuildsBase64(user: DiscordUserProfile) {
  const base64 = user.guildIdsBase64 ?? "";
  const guildIds = Buffer.from(base64, "base64").toString("utf-8");
  return guildIds.split(" ");
}

export function createPixelURL(
  canvasId?: number,
  coords?: Point,
  zoom?: number,
  pixelWidth?: number,
  pixelHeight?: number,
  frameId?: string,
) {
  const parameters = new Map<string, string>();

  const params = [
    { key: "c", value: canvasId?.toString() },
    { key: "x", value: coords?.x.toString() },
    { key: "y", value: coords?.y.toString() },
    { key: "z", value: zoom?.toFixed(3) },
    { key: "w", value: pixelWidth?.toString() },
    { key: "h", value: pixelHeight?.toString() },
    { key: "f", value: frameId?.toUpperCase() },
  ];

  for (const param of params) {
    if (param.value) {
      parameters.set(param.key, param.value);
    }
  }

  const paramsString = Array.from(parameters.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `${config.baseUrl}?${paramsString}`;
}

export function extractSearchParam(
  searchParams: URLSearchParams | null,
  keys: string[],
) {
  if (!searchParams) {
    return null;
  }
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) {
      return value;
    }
  }
  return null;
}
