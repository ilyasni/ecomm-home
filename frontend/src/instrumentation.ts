import { validateRuntimeConfig } from "@/lib/runtime-config";

/**
 * Runs once on server start.
 * Warms up Node.js 20 Web Streams so the first real request does not throw
 * "TypeError: controller[kState].transformAlgorithm is not a function".
 */
export async function register() {
  validateRuntimeConfig();

  // In edge runtime NEXT_RUNTIME is "edge"; skip warmup there
  if (process.env.NEXT_RUNTIME === "edge") return;

  const strapiUrl =
    process.env.STRAPI_INTERNAL_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://strapi:1337";

  try {
    const res = await fetch(`${strapiUrl}/api/products?pagination[pageSize]=1`, {
      cache: "no-store",
    });
    await res.arrayBuffer();
  } catch {
    // Warmup is best-effort — Strapi might not be ready yet
  }
}
