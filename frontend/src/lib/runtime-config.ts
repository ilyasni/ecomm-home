import { hasUsableStrapiToken, isPlaceholderToken } from "@/lib/strapi";

function getMissingVars(): string[] {
  const requiredVars = ["STRAPI_INTERNAL_URL"];
  return requiredVars.filter((name) => !process.env[name]);
}

export function validateRuntimeConfig(): void {
  if (process.env.NODE_ENV !== "production") return;

  const missingVars = getMissingVars();
  if (missingVars.length > 0) {
    throw new Error(`[runtime-config] Missing required env: ${missingVars.join(", ")}`);
  }

  if (isPlaceholderToken(process.env.STRAPI_API_TOKEN)) {
    throw new Error("[runtime-config] STRAPI_API_TOKEN uses placeholder value");
  }

  if (!hasUsableStrapiToken()) {
    throw new Error("[runtime-config] STRAPI_API_TOKEN is missing or invalid");
  }
}
