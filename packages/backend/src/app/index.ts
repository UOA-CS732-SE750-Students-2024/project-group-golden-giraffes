import { Server } from "node:http";
import { prisma } from "@/client";
import config from "@/config";
import { apiRouter } from "@/routes";
import "@/utils"; // Make BigInt JSON serializable
import express, { Express } from "express";

export interface ExpressServer {
  app: Express;
  server: Server;
}

export function createApp(): ExpressServer {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(apiRouter);

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

  type PlacePixel = {
    x: number;
    y: number;
    color: number;
  };

  // Temporary post route until branch with ROUTE setup is merged
  app.get("/api/v1/canvas/:canvasId/pixels", async (req, res) => {
    // TODO: check for authentication
    // Somehow access to user ID after authentication
    const userID = "204778476102877187";

    // Don't really know what the way to add types to this is
    // const body: PlacePixel = req.body;
    const body: PlacePixel = { x: 0, y: 0, color: 0 };

    const canvasId = Number.parseInt(req.params.canvasId);

    // Huge await section; not really leveraging async
    const canvas = await prisma.canvas.findFirst({
      where: { id: canvasId },
    });

    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }

    if (canvas.locked) {
      return res.status(403).json({ message: "Canvas is read-only" });
    }

    // TODO: check for canvas discord_only status (not sure which table to look here)

    // Check against blacklist
    const blacklist = await prisma.blacklist.findFirst({
      where: {
        user_id: BigInt(userID),
      },
    });

    if (blacklist) {
      return res.status(401).json({ message: "User is blacklisted" });
    }

    // Check user cooldown

    const cooldown = await prisma.cooldown.findFirst({
      where: {
        user_id: BigInt(userID),
        canvas_id: canvasId,
      },
    });

    // Deny if the cooldown time is in the future (alternative to cooldown table is to )
    // Can't be sure if cooldown handling is being handled in the database side or the server side
    if (cooldown?.cooldown_time && canvas.cooldown_length) {
      const placedCooldown = cooldown.cooldown_time?.valueOf();
      // Using milliseconds from unix epoch for calculations
      if (placedCooldown + canvas.cooldown_length * 1000 * 60 <= Date.now()) {
        return res
          .status(403)
          .json({ message: "Pixel placement is on cooldown" });
      }
    }

    // check for valid position
    if (
      body.x < 0 ||
      body.y < 0 ||
      body.x >= canvas.width ||
      body.y > canvas.height
    ) {
      return res.status(400).json({ message: "Invalid pixel position" });
    }

    // check for color (also not allow for partnered colours)
    // temped to hard code this even
    const color = await prisma.color.findFirst({
      where: {
        id: body.color,
      },
    });

    if (!color) {
      return res.status(400).json({ message: "Invalid pixel color" });
    }

    if (!color.global) {
      return res
        .status(400)
        .json({ message: "Partnered colours not allowed from web client" });
    }

    // Do both of these within one transaction
    // TODO: update users cooldown table
    // TODO: update pixel
    // TODO: create new history field

    // TODO: return status 201 on success

    res.status(200).json({ message: new Date().valueOf(), other: Date.now() });
  });

  const server = app.listen(config.api.port, () => {
    console.log(`⚡[server]: Server is running on port ${config.api.port}`);
  });

  return { app, server };
}
