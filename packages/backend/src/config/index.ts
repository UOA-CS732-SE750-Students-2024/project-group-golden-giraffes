import dotenv from "dotenv";
import path from "node:path";

dotenv.config();

function requiredEnv(key: keyof NodeJS.ProcessEnv): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable is missing: ${key}`);
  }

  return value;
}

console.log(process.env.PORT);

export default {
  api: {
    port: Number(process.env.PORT || 8000),
  },
  rootDirectory: path.resolve(),
} as const;
