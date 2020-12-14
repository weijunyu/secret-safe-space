export const CorsOrigins = process.env.CORS_ORIGINS
  ? JSON.parse(process.env.CORS_ORIGINS)
  : ["https://luanloot.xyz", "https://luan-loot.web.app"];
