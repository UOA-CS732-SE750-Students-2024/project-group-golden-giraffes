import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

function requiredEnv(key: keyof NodeJS.ProcessEnv): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable is missing: ${key}`);
  }

  return value;
}

const config = {
  api: {
    port: Number(process.env.PORT || 8000),
  },
  paths: {
    root: path.resolve(),
    canvases: path.resolve("static", "canvas"),
  },
  discord: {
    clientId: requiredEnv("DISCORD_CLIENT_ID"),
    clientSecret: requiredEnv("DISCORD_CLIENT_SECRET"),
    loginRedirectUrl: requiredEnv("DISCORD_LOGIN_REDIRECT_URL"),
  },
  session: {
    cookie: "connect.sid", // The name of the cookie used to store the session ID
  },
  /**
   * Placed pixels are typically attributed to guilds they were place in.
   * Identify pixels placed through the web with the ID of 0.
   */
  webGuildId: 0,
} as const;

if (!fs.existsSync(config.paths.canvases)) {
  console.debug(`Creating canvases directory at ${config.paths.canvases}`);
  fs.mkdirSync(config.paths.canvases, { recursive: true });
}

export default config;
