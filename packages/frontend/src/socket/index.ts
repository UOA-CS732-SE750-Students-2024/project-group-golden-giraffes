import config from "@/config";
import { io } from "socket.io-client";

export const socket = io(config.apiUrl, {
  autoConnect: false,
  auth: {
    pixelTimestamp: new Date().toISOString(),
  },
});
