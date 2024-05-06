"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import config from "@/config";
import { CanvasInfo, HistoryRequest } from "@blurple-canvas-web/types";

export function usePixelHistory(
  canvasId: CanvasInfo["id"],
  coordinates: [number, number] | null,
) {
  const fetchHistory = async () => {
    if (coordinates) {
      const response = await axios.get<HistoryRequest.ResBody>(
        `${config.apiUrl}/api/v1/canvas/${canvasId}/pixel/history?x=${coordinates[0]}&y=${coordinates[1]}`,
      );
      return response.data;
    }
    return [];
  };

  return useQuery({
    queryKey: ["pixelHistory", canvasId, coordinates],
    queryFn: fetchHistory,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: [] as HistoryRequest.ResBody,
  });
}
