/**
 * GET /api/admin/search/reindex?secret=<REINDEX_SECRET>
 *
 * Загружает все продукты из Strapi и индексирует их в Meilisearch.
 * Перед загрузкой: конфигурирует индекс (searchable / filterable / sortable).
 *
 * Защита: query-param `secret` должен совпадать с env REINDEX_SECRET.
 * В production вызывать через cron или после деплоя Strapi.
 */

import { NextResponse } from "next/server";
import {
  meiliConfigureIndex,
  meiliIndexProducts,
  isMeilisearchConfigured,
} from "@/lib/meilisearch";
import type { MeiliProduct } from "@/lib/meilisearch";
import { strapiFind } from "@/lib/strapi";

const REINDEX_SECRET = process.env.REINDEX_SECRET ?? "";

export async function GET(req: Request) {
  // ── Auth ──────────────────────────────────────────────────────────────────────
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret") ?? "";

  if (!REINDEX_SECRET || secret !== REINDEX_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMeilisearchConfigured()) {
    return NextResponse.json(
      { error: "Meilisearch not configured (MEILISEARCH_URL / MEILISEARCH_MASTER_KEY missing)" },
      { status: 503 }
    );
  }

  try {
    // ── 1. Конфигурируем индекс ────────────────────────────────────────────────
    await meiliConfigureIndex();

    // ── 2. Забираем все продукты из Strapi (постранично) ──────────────────────
    const allProducts: Record<string, unknown>[] = [];
    let page = 1;
    const pageSize = 100;

    while (true) {
      const res = await strapiFind(
        "products",
        {
          populate: "*",
          "pagination[page]": String(page),
          "pagination[pageSize]": String(pageSize),
        },
        { revalidate: 0, cache: "no-store" }
      );

      const data = (res as { data: Record<string, unknown>[] }).data;
      if (!data || data.length === 0) break;

      allProducts.push(...data);
      if (data.length < pageSize) break;
      page++;
    }

    // ── 3. Маппинг Strapi product → MeiliProduct ──────────────────────────────
    const documents: MeiliProduct[] = allProducts.map((p) => ({
      id: (p.documentId as string) ?? String(p.id),
      title: (p.title as string) ?? "",
      description: (p.description as string) ?? undefined,
      sku: (p.sku as string) ?? undefined,
      price: typeof p.price === "number" ? p.price : undefined,
      oldPrice: typeof p.oldPrice === "number" ? p.oldPrice : undefined,
      badge: (p.badge as string) ?? undefined,
      slug: (p.slug as string) ?? undefined,
      fabric: (p.fabric as string) ?? undefined,
      density: (p.density as string) ?? undefined,
      size: (p.size as string) ?? undefined,
      color: (p.color as string) ?? undefined,
    }));

    // ── 4. Индексируем ────────────────────────────────────────────────────────
    const result = await meiliIndexProducts(documents);

    return NextResponse.json({
      ok: true,
      indexed: documents.length,
      taskUid: result.taskUid,
    });
  } catch (error) {
    console.error("[/api/admin/search/reindex]", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
