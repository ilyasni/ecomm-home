import { defineConfig } from "@medusajs/framework/utils";

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions:
      process.env.NODE_ENV === "production"
        ? { ssl: { rejectUnauthorized: false } }
        : {},
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "./src/modules/payment-yookassa",
      options: {
        shopId: process.env.YOOKASSA_SHOP_ID ?? "test_shop",
        secretKey: process.env.YOOKASSA_SECRET_KEY ?? "test_secret_key",
      },
    },
  ],
});
