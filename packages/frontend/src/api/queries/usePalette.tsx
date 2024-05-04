import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import config from "@/config";
import { BlurpleEvent, PaletteRequest } from "@blurple-canvas-web/types";

export function usePalette(eventId: BlurpleEvent["id"]) {
  const getPalette = async () => {
    const response = await axios.get<PaletteRequest.ResBody>(
      `${config.apiUrl}/api/v1/palette/${eventId}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["palette", eventId],
    queryFn: getPalette,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialData: [] as PaletteRequest.ResBody,
    placeholderData: [] as PaletteRequest.ResBody,
  });
}
