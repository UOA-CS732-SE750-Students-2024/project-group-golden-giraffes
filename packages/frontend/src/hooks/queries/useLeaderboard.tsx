"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import config from "@/config";
import { CanvasInfo, CanvasInfoRequest } from "@blurple-canvas-web/types";

export function useLeaderboard(canvasId: CanvasInfo["id"]) {
  const getLeaderboard = async () => {
    const response = await axios.get<CanvasInfoRequest.ResBody>(
      `${config.apiUrl}/api/v1/statistics/leaderboard/${canvasId}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["leaderboard", canvasId],
    queryFn: getLeaderboard,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
