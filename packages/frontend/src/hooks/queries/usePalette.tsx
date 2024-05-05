"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import convert from "color-convert";

import config from "@/config";
import {
  BlurpleEvent,
  Palette,
  PaletteRequest,
} from "@blurple-canvas-web/types";
import { RGB } from "color-convert/conversions";

export function usePalette(eventId?: BlurpleEvent["id"]) {
  const getPalette = async () => {
    const response = await axios.get<PaletteRequest.ResBody>(
      `${config.apiUrl}/api/v1/palette/${eventId ?? "current"}`,
    );
    return sortPalette(response.data);
  };

  return useQuery({
    queryKey: ["palette", eventId],
    queryFn: getPalette,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: [] as PaletteRequest.ResBody,
  });
}

function sortPalette(palette: Palette) {
  return [...palette].sort((a, b) => {
    const aHue = convert.rgb.hsl(a.rgba.slice(0, 3) as RGB)[0];
    const bHue = convert.rgb.hsl(b.rgba.slice(0, 3) as RGB)[0];
    return aHue - bHue;
  });
}
