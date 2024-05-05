"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import config from "@/config";
import { CanvasInfo, CanvasInfoRequest } from "@blurple-canvas-web/types";

export function useCanvasInfo(canvasId?: CanvasInfo["id"]) {
  const getMainCanvasInfo = async () => {
    const response = await axios.get<CanvasInfoRequest.ResBody>(
      `${config.apiUrl}/api/v1/canvas/${canvasId ?? "current"}/info`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["canvasInfo", canvasId],
    queryFn: getMainCanvasInfo,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
