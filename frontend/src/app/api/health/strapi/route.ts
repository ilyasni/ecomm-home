import { NextResponse } from "next/server";
import { getStrapiBaseUrl, hasUsableStrapiToken } from "@/lib/strapi";
import { validateRuntimeConfig } from "@/lib/runtime-config";

export const dynamic = "force-dynamic";

function buildHeaders(): HeadersInit {
  if (!hasUsableStrapiToken()) return { "Content-Type": "application/json" };
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  };
}

export async function GET() {
  try {
    validateRuntimeConfig();

    const baseUrl = getStrapiBaseUrl();
    const headers = buildHeaders();

    const [healthRes, productsRes] = await Promise.all([
      fetch(`${baseUrl}/_health`, {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }),
      fetch(`${baseUrl}/api/products?pagination[pageSize]=1`, {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }),
    ]);

    const ok = healthRes.ok && productsRes.ok;
    const status = ok ? 200 : 503;

    return NextResponse.json(
      {
        ok,
        checks: {
          strapiHealth: { ok: healthRes.ok, status: healthRes.status },
          productsApi: { ok: productsRes.ok, status: productsRes.status },
        },
        timestamp: new Date().toISOString(),
      },
      { status }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown health check error";
    return NextResponse.json(
      {
        ok: false,
        checks: null,
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
