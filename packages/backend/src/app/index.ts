import { Server } from "node:http";
import cors from "cors";
import express, { Express } from "express";

import { prisma } from "@/client";
import config from "@/config";
import { apiRouter } from "@/routes";
import "@/utils"; // Make BigInt JSON serializable
import { initializeAuth } from "@/middleware/auth";
import proxy from "express-http-proxy";

export interface ExpressServer {
  app: Express;
  server: Server;
}

export function createApp(): ExpressServer {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  initializeAuth(app);
  app.use(apiRouter);
  app.use(proxy("http://localhost:3000")); // assuming your Reacts runs on P3000

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

  const server = app.listen(config.api.port, () => {
    console.log(`⚡[server]: Server is running on port ${config.api.port}`);
  });

  return { app, server };
}
