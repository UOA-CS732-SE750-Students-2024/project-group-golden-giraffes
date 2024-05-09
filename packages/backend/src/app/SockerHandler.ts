import { prisma } from "@/client";
import { Server, Socket } from "socket.io";

import { PlacePixelSocket } from "@blurple-canvas-web/types";

const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

function timestampTooLongAgo(timestamp: string): boolean {
  return Date.now() - new Date(timestamp).getTime() > TEN_MINUTES_IN_MS;
}

export class SocketHandler {
  public constructor(private io: Server) {
    this.io.on("connection", this.onConnection);
  }

  private onConnection(socket: Socket) {
    console.log(`[Socket ${socket.id}]: Client connected`);

    socket.on("disconnect", () => {
      console.log(`[Socket ${socket.id}]: Client disconnected`);
    });

    // If the socket wasn't able to automatically recover after a temporary disconnection
    const { pixelTimestamp, canvasId } = socket.handshake.auth;
    if (
      !socket.recovered &&
      pixelTimestamp &&
      canvasId &&
      !timestampTooLongAgo(pixelTimestamp)
    ) {
      prisma.history
        .findMany({
          select: {
            x: true,
            y: true,
            color: { select: { rgba: true } },
          },
          where: {
            canvas_id: canvasId,
            timestamp: {
              // Greater than or equal as multiple pixels may have been placed at the same time and
              // we don't know which ones they received.
              gte: socket.handshake.auth.pixelTimestamp,
            },
          },
        })
        .then((pixels) => {
          console.log(
            `[Socket ${socket.id}]: Synchronizing client requires ${pixels.length} pixels to be sent`,
          );

          for (const pixel of pixels) {
            socket.emit(`place pixel ${canvasId}`, {
              x: pixel.x,
              y: pixel.y,
              color: pixel.color.rgba,
            });
          }
        });
    }
  }

  public broadcastPixelPlacement(
    canvasId: number,
    payload: PlacePixelSocket.Payload,
  ) {
    this.io.emit(`place pixel ${canvasId}`, payload);
  }
}
