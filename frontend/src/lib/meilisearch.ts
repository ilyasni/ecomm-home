/**
 * Meilisearch client — Phase 4
 *
 * Env vars (server-only):
 *   MEILISEARCH_URL         — внутренний URL (http://meilisearch:7700)
 *   MEILISEARCH_MASTER_KEY  — мастер-ключ для поиска и индексирования
 *
 * Graceful: если env не заданы → isMeilisearchConfigured() = false →
 *           searchProducts() откатывается к Strapi $containsi.
 */

const MEILISEARCH_URL = process.env.MEILISEARCH_URL ?? "";
const MEILISEARCH_KEY = process.env.MEILISEARCH_MASTER_KEY ?? "";

const PRODUCTS_INDEX = "products";

/** Возвращает true только если оба env заданы и непусты */
export function isMeilisearchConfigured(): boolean {
  return Boolean(MEILISEARCH_URL && MEILISEARCH_KEY);
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface MeiliProduct {
  id: string;
  title: string;
  description?: string;
  sku?: string;
  price?: number;
  oldPrice?: number;
  badge?: string;
  slug?: string;
  image?: string;
  fabric?: string;
  density?: string;
  size?: string;
  color?: string;
}

export interface MeiliSearchResult {
  hits: MeiliProduct[];
  totalHits: number;
  page: number;
  hitsPerPage: number;
  facetDistribution?: Record<string, Record<string, number>>;
}

// ── Search ─────────────────────────────────────────────────────────────────────

export async function meiliSearchProducts(options: {
  query: string;
  page?: number;
  hitsPerPage?: number;
  /** Meilisearch facetFilters формат: [["fabric:Сатин"], ["color:Белый"]] */
  facetFilters?: string[][];
}): Promise<MeiliSearchResult> {
  const { query, page = 1, hitsPerPage = 12, facetFilters } = options;

  const body: Record<string, unknown> = {
    q: query,
    page,
    hitsPerPage,
    facets: ["fabric", "density", "size", "color", "badge"],
  };
  if (facetFilters?.length) body.facetFilters = facetFilters;

  const res = await fetch(`${MEILISEARCH_URL}/indexes/${PRODUCTS_INDEX}/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MEILISEARCH_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Meilisearch search error: ${res.status}`);
  }

  return res.json() as Promise<MeiliSearchResult>;
}

// ── Indexing ───────────────────────────────────────────────────────────────────

export async function meiliIndexProducts(documents: MeiliProduct[]): Promise<{ taskUid: number }> {
  const res = await fetch(`${MEILISEARCH_URL}/indexes/${PRODUCTS_INDEX}/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MEILISEARCH_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(documents),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Meilisearch index error: ${res.status} ${text.slice(0, 200)}`);
  }

  return res.json() as Promise<{ taskUid: number }>;
}

export async function meiliDeleteProduct(id: string): Promise<{ taskUid: number }> {
  const res = await fetch(
    `${MEILISEARCH_URL}/indexes/${PRODUCTS_INDEX}/documents/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${MEILISEARCH_KEY}` },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(`Meilisearch delete error: ${res.status}`);
  }
  return res.json() as Promise<{ taskUid: number }>;
}

// ── Index configuration ────────────────────────────────────────────────────────

/**
 * Создаёт индекс (игнорирует ошибку если уже существует)
 * и конфигурирует searchable + filterable + sortable атрибуты.
 * Вызывается из /api/admin/search/reindex перед загрузкой данных.
 */
export async function meiliConfigureIndex(): Promise<void> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${MEILISEARCH_KEY}`,
    "Content-Type": "application/json",
  };

  // Создать индекс (409 = уже существует — OK)
  await fetch(`${MEILISEARCH_URL}/indexes`, {
    method: "POST",
    headers,
    body: JSON.stringify({ uid: PRODUCTS_INDEX, primaryKey: "id" }),
    cache: "no-store",
  });

  // Атрибуты поиска (порядок влияет на ранжирование)
  await fetch(`${MEILISEARCH_URL}/indexes/${PRODUCTS_INDEX}/settings/searchable-attributes`, {
    method: "PUT",
    headers,
    body: JSON.stringify(["title", "description", "sku", "fabric", "color"]),
    cache: "no-store",
  });

  // Атрибуты фильтрации / фасетов
  await fetch(`${MEILISEARCH_URL}/indexes/${PRODUCTS_INDEX}/settings/filterable-attributes`, {
    method: "PUT",
    headers,
    body: JSON.stringify(["fabric", "density", "size", "color", "badge"]),
    cache: "no-store",
  });

  // Атрибуты сортировки
  await fetch(`${MEILISEARCH_URL}/indexes/${PRODUCTS_INDEX}/settings/sortable-attributes`, {
    method: "PUT",
    headers,
    body: JSON.stringify(["price"]),
    cache: "no-store",
  });
}
