import { Server } from "node:http";
import express, { Express } from "express";
import config from "../config";

export interface ExpressServer {
  app: Express;
  server: Server;
}

export function createApp(): ExpressServer {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get("/", (req, res) => {
    res.json({ message: "Hello, world!" });
  });

  const server = app.listen(config.api.port, () => {
    console.log(`⚡[server]: Server is running on port ${config.api.port}`);
  });

  return { app, server };
}
