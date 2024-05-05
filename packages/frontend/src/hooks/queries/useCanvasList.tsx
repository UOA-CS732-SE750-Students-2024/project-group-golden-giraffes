"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import config from "@/config";
import { CanvasListRequest } from "@blurple-canvas-web/types";

export function useCanvasList() {
  const getSummaryOfCanvases = async () => {
    const response = await axios.get<CanvasListRequest.ResBody>(
      `${config.apiUrl}/api/v1/canvas/`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["canvas"],
    queryFn: getSummaryOfCanvases,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: [] as CanvasListRequest.ResBody,
  });
}
