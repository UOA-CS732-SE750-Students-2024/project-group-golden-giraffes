"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import config from "@/config";
import { CanvasInfo, HistoryRequest, Point } from "@blurple-canvas-web/types";

export function usePixelHistory(
  canvasId: CanvasInfo["id"],
  coordinates: Point | null,
) {
  const fetchHistory = async ({ signal }: { signal: AbortSignal }) => {
    if (!coordinates) return [] as HistoryRequest.ResBody;

    const { x, y } = coordinates;
    const response = await axios.get<HistoryRequest.ResBody>(
      `${config.apiUrl}/api/v1/canvas/${canvasId}/pixel/history?x=${x}&y=${y}`,
      { signal },
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["pixelHistory", canvasId, coordinates],
    queryFn: fetchHistory,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
