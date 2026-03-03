/**
 * POST /api/admin/search/webhook?secret=<REINDEX_SECRET>
 *
 * Strapi webhook endpoint: обновляет Meilisearch при изменении продукта.
 *
 * Настройка в Strapi Admin → Settings → Webhooks:
 *   URL:    http://frontend:3000/api/admin/search/webhook?secret=<REINDEX_SECRET>
 *   Events: entry.create, entry.update, entry.delete,
 *           entry.publish, entry.unpublish
 *   Model:  product
 *
 * - entry.create / entry.update / entry.publish  → upsert документа
 * - entry.delete / entry.unpublish               → удаление документа
 */

import { NextResponse } from "next/server";
import {
  isMeilisearchConfigured,
  meiliIndexProducts,
  meiliDeleteProduct,
  type MeiliProduct,
} from "@/lib/meilisearch";

const REINDEX_SECRET = process.env.REINDEX_SECRET ?? "";

/** Маппинг Strapi entry → MeiliProduct (повторяет логику reindex route) */
function mapEntry(entry: Record<string, unknown>): MeiliProduct {
  return {
    id: (entry.documentId as string) ?? String(entry.id),
    title: (entry.title as string) ?? "",
    description: (entry.description as string) ?? undefined,
    sku: (entry.sku as string) ?? undefined,
    price: typeof entry.price === "number" ? entry.price : undefined,
    oldPrice: typeof entry.oldPrice === "number" ? entry.oldPrice : undefined,
    badge: (entry.badge as string) ?? undefined,
    slug: (entry.slug as string) ?? undefined,
    fabric: (entry.fabric as string) ?? undefined,
    density: (entry.density as string) ?? undefined,
    size: (entry.size as string) ?? undefined,
    color: (entry.color as string) ?? undefined,
  };
}

const UPSERT_EVENTS = new Set(["entry.create", "entry.update", "entry.publish"]);
const DELETE_EVENTS = new Set(["entry.delete", "entry.unpublish"]);

export async function POST(req: Request) {
  // ── Auth ──────────────────────────────────────────────────────────────────────
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret") ?? "";
  if (!REINDEX_SECRET || secret !== REINDEX_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMeilisearchConfigured()) {
    // Graceful: если Meilisearch не настроен — не ошибка, просто пропускаем
    return NextResponse.json({ ok: true, skipped: "meilisearch not configured" });
  }

  // ── Parse body ────────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, model, entry } = body as {
    event?: string;
    model?: string;
    entry?: Record<string, unknown>;
  };

  // Обрабатываем только модель product
  if (model !== "product") {
    return NextResponse.json({ ok: true, skipped: `model=${String(model)}` });
  }

  if (!entry) {
    return NextResponse.json({ error: "Missing entry in payload" }, { status: 400 });
  }

  try {
    if (UPSERT_EVENTS.has(event ?? "")) {
      const doc = mapEntry(entry);
      const result = await meiliIndexProducts([doc]);
      return NextResponse.json({ ok: true, action: "upsert", id: doc.id, taskUid: result.taskUid });
    }

    if (DELETE_EVENTS.has(event ?? "")) {
      const id = (entry.documentId as string) ?? String(entry.id);
      const result = await meiliDeleteProduct(id);
      return NextResponse.json({ ok: true, action: "delete", id, taskUid: result.taskUid });
    }

    return NextResponse.json({ ok: true, skipped: `event=${String(event)}` });
  } catch (error) {
    console.error("[/api/admin/search/webhook]", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
