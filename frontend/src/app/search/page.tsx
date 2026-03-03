import type { Metadata } from "next";
import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import type { Product } from "@/components/catalog/ProductCard";
import { searchProducts, type SearchResult } from "@/lib/queries/search";
import { withFallback } from "@/lib/with-fallback";
import { formatPrice, mapMediaOrPlaceholder } from "@/lib/mappers";
import { SearchPageClient } from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Поиск",
  description: "Поиск товаров Vita Brava Home",
};

/** Filterable Meilisearch attributes, отражённые в FiltersPanel */
const FILTER_KEYS = ["fabric", "density", "size", "color"] as const;

/** Нормализует searchParam в массив строк */
function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

const EMPTY_RESULT: SearchResult = {
  data: [],
  meta: { pagination: { page: 1, pageSize: 24, total: 0 } },
};

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function mapResult(raw: Record<string, unknown>): Product {
  return {
    id: (raw.documentId as string) ?? String(raw.id),
    slug: (raw.slug as string) ?? undefined,
    title: (raw.title as string) ?? "Товар",
    description: (raw.description as string) ?? "",
    price: raw.price ? formatPrice(raw.price as number) : "0 ₽",
    oldPrice: raw.oldPrice ? formatPrice(raw.oldPrice as number) : undefined,
    image: mapMediaOrPlaceholder(raw.image as never),
    badge: (raw.badge as string) ?? undefined,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").trim();

  // Собираем активные фильтры из URL
  const activeFilters: Record<string, string[]> = {};
  for (const key of FILTER_KEYS) {
    const vals = toArray(params[key]);
    if (vals.length > 0) activeFilters[key] = vals;
  }

  // Формат facetFilters для Meilisearch: AND между полями, OR внутри поля
  const facetFilters: string[][] = Object.entries(activeFilters).map(([key, vals]) =>
    vals.map((v) => `${key}:${v}`)
  );

  const hasSearch = Boolean(query) || facetFilters.length > 0;

  const result = hasSearch
    ? await withFallback(
        () => searchProducts(query, 1, 24, facetFilters.length ? facetFilters : undefined),
        EMPTY_RESULT
      )
    : EMPTY_RESULT;

  const products = result.data.map(mapResult);
  const totalCount = result.meta.pagination.total;
  const facetDistribution = result.meta.facetDistribution;

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer variant="solid" />
      <main className="pt-[111px] md:pt-[143px]">
        <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 pb-12 md:px-[39px] md:pb-20">
          <h1 className="mb-6 text-center text-[28px] leading-[1.2] font-medium md:mb-8 md:text-[36px]">
            Поиск товаров
          </h1>

          <form className="mb-8" action="/search">
            {/* Сохраняем активные фильтры при новом поиске */}
            {Object.entries(activeFilters).flatMap(([key, vals]) =>
              vals.map((v) => <input key={`${key}:${v}`} type="hidden" name={key} value={v} />)
            )}
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Введите название, артикул или ключевое слово"
              className="w-full rounded-[5px] border border-[var(--color-gray-light)] px-4 py-3"
            />
          </form>

          {!hasSearch ? (
            <p className="text-center text-[var(--color-dark)]">
              Введи запрос, чтобы найти товары.
            </p>
          ) : (
            <SearchPageClient
              query={query}
              products={products}
              activeFilters={activeFilters}
              totalCount={totalCount}
              facetDistribution={facetDistribution}
            />
          )}
        </div>
      </main>
      <FooterServer />
    </div>
  );
}
