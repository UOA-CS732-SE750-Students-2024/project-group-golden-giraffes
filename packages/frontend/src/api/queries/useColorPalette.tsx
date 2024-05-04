import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function usePalette(eventId: EvendId) {
  const queryKey = ["palette", eventId];
  const getPalette = () => axios.get(`/palette/${eventId}`);

  return useQuery({
    queryKey,
    queryFn: getPalette,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialData: [],
    placeholderData: [],
  });
}
