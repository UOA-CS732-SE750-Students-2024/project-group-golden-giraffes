"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import config from "@/config";
import { BlurpleEvent, PaletteRequest } from "@blurple-canvas-web/types";

export function usePalette(eventId?: BlurpleEvent["id"]) {
  const getPalette = async () => {
    const response = await axios.get<PaletteRequest.ResBody>(
      `${config.apiUrl}/api/v1/palette/${eventId ?? "current"}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["palette", eventId],
    queryFn: getPalette,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: [] as PaletteRequest.ResBody,
  });
}