import cors from "cors";
import express from "express";

import { prisma } from "@/client";
import config from "@/config";
import { apiRouter } from "@/routes";
import "@/utils"; // Make BigInt JSON serializable
import { createServer } from "node:http";
import { initializeAuth } from "@/middleware/auth";
import { Server } from "socket.io";

export function createApp() {
  const app = express();

  const corsOptions = {
    origin: config.frontendUrl,
    credentials: true,
  };
  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  initializeAuth(app);
  app.use(apiRouter);

  const server = createServer(app);
  const io = new Server(server);

  app.get("/", (req, res) => {
    res.json({ message: "Hello, world!" });
  });

  app.get("/pixels", async (req, res) => {
    // Example usage :)
    const pixels = await prisma.pixel.findMany({
      // Only select a subset of the table
      select: { x: true, y: true, color_id: true },
      where: {
        x: { lte: 10 },
        y: { lte: 10 },
      },
    });

    res.status(200).json(pixels);
  });

  app.get("/stats", async (req, res) => {
    // Testing views in Prisma
    const rocked03Stats = await prisma.user_stats.findFirst({
      where: { user_id: BigInt("204778476102877187"), canvas_id: 2023 },
      include: { user: true },
    });

    if (rocked03Stats) {
      res.status(200).json(rocked03Stats);
    } else {
      res.status(404).json({ message: "No stats found :pensive:" });
    }
  });

  server.listen(config.api.port, () => {
    console.log(`⚡[server]: Server is running on port ${config.api.port}`);
  });
}
