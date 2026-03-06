import type { CatalogSortValue } from "@/lib/catalog-filters";

const RESERVED_QUERY_KEYS = new Set(["page", "pageSize", "sort", "q"]);

type BuildCatalogQueryInput = {
  base: URLSearchParams;
  sort: CatalogSortValue;
  page: number;
  pageSize: number;
  filters: Record<string, string[]>;
};

export function buildCatalogQueryFromBase({
  base,
  sort,
  page,
  pageSize,
  filters,
}: BuildCatalogQueryInput): string {
  const next = new URLSearchParams(base.toString());

  if (sort === "popular") next.delete("sort");
  else next.set("sort", sort);

  if (page <= 1) next.delete("page");
  else next.set("page", String(page));

  if (pageSize === 24) next.delete("pageSize");
  else next.set("pageSize", String(pageSize));

  const existingFilterKeys = new Set<string>();
  next.forEach((_, key) => {
    if (!RESERVED_QUERY_KEYS.has(key)) existingFilterKeys.add(key);
  });

  const nextFilterKeys = new Set(Object.keys(filters));
  [...existingFilterKeys, ...nextFilterKeys].forEach((key) => next.delete(key));

  Object.entries(filters).forEach(([key, values]) => {
    values.forEach((value) => next.append(key, value));
  });

  return next.toString();
}
