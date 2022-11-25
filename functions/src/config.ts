export const CorsOrigins = process.env.CORS_ORIGINS
  ? JSON.parse(process.env.CORS_ORIGINS) // e.g. CORS_ORIGINS=["http://localhost:3000"]
  : ["https://secret-safe-space.web.app"];
export const logLevel = process.env.LOG_LEVEL ?? "info";
