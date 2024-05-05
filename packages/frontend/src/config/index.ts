const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
} as const;

export default config;
