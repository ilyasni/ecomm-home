import { strapiSingleType, strapiFind } from "@/lib/strapi";
import { isMeilisearchConfigured, meiliSearchProducts } from "@/lib/meilisearch";

export interface SearchPopularQuery {
  id: number;
  label: string;
  href: string;
}

export interface SearchConfigData {
  popularQueries: SearchPopularQuery[];
  featuredProducts: unknown[];
  featuredImage: unknown;
}

export async function getSearchConfig() {
  return strapiSingleType<SearchConfigData>(
    "search-config",
    {
      "populate[popularQueries]": "true",
      "populate[featuredProducts][populate]": "*",
      "populate[featuredImage]": "true",
    },
    { revalidate: 300, tags: ["search-config"] }
  );
}

export interface SearchResult {
  data: Record<string, unknown>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      total: number;
    };
    /** Meilisearch facetDistribution: { fabric: { Сатин: 45, Шёлк: 23 }, ... } */
    facetDistribution?: Record<string, Record<string, number>>;
  };
}

/**
 * Поиск товаров.
 * Приоритет: Meilisearch (если настроен) → Strapi $containsi (fallback).
 *
 * @param facetFilters — Meilisearch facetFilters, напр. [["fabric:Сатин"], ["color:Белый"]]
 *                       Игнорируются при fallback к Strapi.
 */
export async function searchProducts(
  query: string,
  page = 1,
  pageSize = 12,
  facetFilters?: string[][]
): Promise<SearchResult> {
  // ── Meilisearch (приоритет) ──────────────────────────────────────────────────
  if (isMeilisearchConfigured()) {
    try {
      const result = await meiliSearchProducts({
        query,
        page,
        hitsPerPage: pageSize,
        facetFilters,
      });
      return {
        data: result.hits as unknown as Record<string, unknown>[],
        meta: {
          pagination: {
            page,
            pageSize,
            total: result.totalHits,
          },
          facetDistribution: result.facetDistribution,
        },
      };
    } catch (err) {
      console.warn("[searchProducts] Meilisearch failed, falling back to Strapi:", err);
    }
  }

  // ── Strapi fallback ($containsi) ─────────────────────────────────────────────
  return strapiFind(
    "products",
    {
      "filters[$or][0][title][$containsi]": query,
      "filters[$or][1][description][$containsi]": query,
      "filters[$or][2][sku][$containsi]": query,
      populate: "*",
      "pagination[page]": String(page),
      "pagination[pageSize]": String(pageSize),
    },
    { revalidate: 0, cache: "no-store" }
  ) as Promise<SearchResult>;
}
