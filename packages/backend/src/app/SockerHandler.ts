import { PlacePixelSocket } from "@blurple-canvas-web/types";
import { Server, Socket } from "socket.io";

export class SocketHandler {
  public constructor(private io: Server) {
    this.io.on("connection", this.onConnection);
  }

  private onConnection(socket: Socket) {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  }

  public broadcastPlacePixel(
    canvasId: number,
    payload: PlacePixelSocket.Payload,
  ) {
    this.io.emit(`place pixel ${canvasId}`, payload);
  }
}
