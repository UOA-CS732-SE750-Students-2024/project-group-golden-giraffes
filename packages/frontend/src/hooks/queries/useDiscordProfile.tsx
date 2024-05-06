"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import config from "@/config";
import { DiscordProfileRequest } from "@blurple-canvas-web/types";

export function useDiscordProfile(userId: string) {
  const fetchProfile = async () => {
    const response = await axios.get<DiscordProfileRequest.ResBody>(
      `${config.apiUrl}/api/v1/discord/cache/${userId}`,
    );
    if (response.status !== 200) {
      return null;
    }
    return response.data;
  };

  const queryResponse = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: fetchProfile,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return queryResponse;
}
