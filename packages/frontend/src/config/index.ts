const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  baseUrl:
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  port: process.env.PORT || 3000,
} as const;

export default config;
