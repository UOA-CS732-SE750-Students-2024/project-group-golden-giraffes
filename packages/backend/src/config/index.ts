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
} as const;

if (!fs.existsSync(config.paths.canvases)) {
  console.debug(`Creating canvases directory at ${config.paths.canvases}`);
  fs.mkdirSync(config.paths.canvases, { recursive: true });
}

export default config;
