"use client";

import config from "@/config";
import {
  DiscordGuildRecord,
  DiscordUserProfile,
  Frame,
  FrameRequest,
} from "@blurple-canvas-web/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useFrame({
  frameId,
  canvasId,
  userId,
  guildIds,
}: {
  frameId?: Frame["id"];
  canvasId?: Frame["canvas_id"];
  userId?: DiscordUserProfile["id"];
  guildIds?: DiscordGuildRecord["guild_id"][];
}) {
  const getFrame = async (): Promise<Frame[]> => {
    if (frameId) {
      if (canvasId || userId || guildIds) {
        throw new Error(
          "Cannot specify multiple query parameters with frameId",
        );
      }

      const response = await axios.get<FrameRequest.ResBody>(
        `${config.apiUrl}/api/v1/frame/${frameId}`,
      );
      return response.data;
    }

    if (!canvasId) {
      throw new Error(
        "Must specify canvasId when querying by userId or guildIds",
      );
    }

    if ((userId && guildIds) || (!userId && !guildIds)) {
      return [];
    }

    if (userId) {
      const response = await axios.get<FrameRequest.ResBody>(
        `${config.apiUrl}/api/v1/frame/user/${userId}/${canvasId}`,
      );
      return response.data;
    }

    if (guildIds) {
      const response = await axios.get<FrameRequest.ResBody>(
        `${config.apiUrl}/api/v1/frame/guild/${canvasId}`,
      );
      return response.data;
    }

    return [];
  };

  return useQuery({
    queryKey: ["frame", frameId],
    queryFn: getFrame,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: [] as FrameRequest.ResBody,
  });
}
