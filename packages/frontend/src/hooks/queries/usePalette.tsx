"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import config from "@/config";
import {
  BlurpleEvent,
  Palette,
  PaletteRequest,
} from "@blurple-canvas-web/types";
import Color, { Coords } from "colorjs.io";

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

const sortPalette = (palette: Palette) =>
  [...palette].sort(
    (a, b) =>
      new Color(`rgba(${a.rgba.join(",")})`).hsl[0] -
      new Color(`rgba(${b.rgba.join(",")})`).hsl[0],
  );
