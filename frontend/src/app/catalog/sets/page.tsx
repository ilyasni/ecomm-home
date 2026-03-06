import { SetsCatalogClient } from "./SetsCatalogClient";
import { getSetProducts } from "@/lib/queries/catalog";
import { withFallback } from "@/lib/with-fallback";
import { mapMedia, formatPrice } from "@/lib/mappers";
import type { StrapiMedia } from "@/types/strapi";
import { setProducts as mockSetProducts } from "@/data/sets";
import type { Product } from "@/components/catalog/ProductCard";
import type { Metadata } from "next";
import {
  buildStrapiFiltersFromCatalog,
  mapSortToStrapi,
  parseCatalogSearchParams,
} from "@/lib/catalog-filters";

export const metadata: Metadata = {
  title: "Собери свой комплект",
  description: "Собери свой комплект постельного белья — Vita Brava Home",
};

function mapStrapiProducts(data: Record<string, unknown>[]): Product[] {
  return data.map((p) => ({
    id: (p.documentId as string) ?? String(p.id),
    title: p.title as string,
    description: (p.description as string) ?? undefined,
    price: formatPrice(p.price as number),
    oldPrice: p.oldPrice ? formatPrice(p.oldPrice as number) : undefined,
    image: mapMedia(p.image as StrapiMedia | null | undefined) ?? "/assets/figma/placeholder.svg",
    badge: (p.badge as string) ?? undefined,
    rating: (p.rating as number) ?? undefined,
    sku: (p.sku as string) ?? undefined,
    colors: (p.colors as Product["colors"]) ?? undefined,
  }));
}

interface SetsCatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SetsCatalogPage({ searchParams }: SetsCatalogPageProps) {
  const rawSearchParams = await searchParams;
  const searchState = parseCatalogSearchParams(rawSearchParams);
  const strapiFilters = buildStrapiFiltersFromCatalog(searchState.filters);

  const productsFromApi = await withFallback(
    async () => {
      const res = await getSetProducts({
        page: searchState.page,
        pageSize: searchState.pageSize,
        sort: mapSortToStrapi(searchState.sort),
        filters: strapiFilters,
      });

      return {
        products: mapStrapiProducts(res.data as unknown as Record<string, unknown>[]),
        pagination: res.meta.pagination,
      };
    },
    null as {
      products: Product[];
      pagination?: { page: number; pageCount: number; total: number };
    } | null
  );

  const products = productsFromApi ? productsFromApi.products : mockSetProducts;
  const totalCount = productsFromApi
    ? (productsFromApi.pagination?.total ?? products.length)
    : products.length;
  const page = productsFromApi?.pagination?.page ?? searchState.page;
  const totalPages = productsFromApi?.pagination?.pageCount ?? 1;

  return (
    <SetsCatalogClient
      products={products}
      totalCount={totalCount}
      page={page}
      totalPages={totalPages}
      pageSize={searchState.pageSize}
      sortValue={searchState.sort}
      activeFilters={searchState.filters}
    />
  );
}
