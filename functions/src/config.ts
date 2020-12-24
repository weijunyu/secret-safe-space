export const CorsOrigins = process.env.CORS_ORIGINS
  ? JSON.parse(process.env.CORS_ORIGINS) // e.g. CORS_ORIGINS='["http://localhost:3000"]
  : [
      "https://luanloot.xyz",
      "https://luan-loot.web.app",
      "https://secretsafe.space",
    ];
