export type CatalogSortValue = "popular" | "price-asc" | "price-desc" | "new" | "sale" | "hits";

export type CatalogFilterOption = {
  id: string;
  label: string;
  value: string;
};

export type CatalogFilterSection = {
  id: string;
  title: string;
  options: CatalogFilterOption[];
};

export type CatalogSearchState = {
  sort: CatalogSortValue;
  page: number;
  pageSize: number;
  filters: Record<string, string[]>;
};

const SORT_TO_STRAPI: Record<CatalogSortValue, string> = {
  popular: "createdAt:desc",
  "price-asc": "price:asc",
  "price-desc": "price:desc",
  new: "createdAt:desc",
  sale: "oldPrice:desc",
  hits: "rating:desc",
};

const SORT_VALUES = new Set<CatalogSortValue>([
  "popular",
  "price-asc",
  "price-desc",
  "new",
  "sale",
  "hits",
]);

const RESERVED_QUERY_KEYS = new Set(["page", "pageSize", "sort", "q"]);

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toPositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toFilterId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)+/g, "");
}

export function normalizeSort(value: string | undefined): CatalogSortValue {
  if (value && SORT_VALUES.has(value as CatalogSortValue)) {
    return value as CatalogSortValue;
  }
  return "popular";
}

export function mapSortToStrapi(sort: CatalogSortValue): string {
  return SORT_TO_STRAPI[sort];
}

export function parseCatalogSearchParams(
  params: Record<string, string | string[] | undefined>,
  allowedFilterKeys?: string[]
): CatalogSearchState {
  const sort = normalizeSort(typeof params.sort === "string" ? params.sort : undefined);
  const page = toPositiveInt(typeof params.page === "string" ? params.page : undefined, 1);
  const pageSize = Math.min(
    toPositiveInt(typeof params.pageSize === "string" ? params.pageSize : undefined, 24),
    100
  );

  const filters: Record<string, string[]> = {};
  const allowSet = allowedFilterKeys ? new Set(allowedFilterKeys) : null;

  for (const [key, raw] of Object.entries(params)) {
    if (RESERVED_QUERY_KEYS.has(key)) continue;
    if (allowSet && !allowSet.has(key)) continue;
    const values = toArray(raw)
      .map((v) => v.trim())
      .filter(Boolean);
    if (values.length > 0) filters[key] = values;
  }

  return { sort, page, pageSize, filters };
}

export function buildCategoryFilterSections(
  categoryFilters: Array<{ title: string; options?: Array<{ label: string; href: string }> }>
): CatalogFilterSection[] {
  return categoryFilters
    .map((section) => {
      const byKey = new Map<string, CatalogFilterOption[]>();
      (section.options ?? []).forEach((option) => {
        const queryString = option.href.includes("?") ? option.href.split("?")[1] : "";
        const params = new URLSearchParams(queryString);
        params.forEach((value, key) => {
          if (RESERVED_QUERY_KEYS.has(key)) return;
          const list = byKey.get(key) ?? [];
          const exists = list.some((item) => item.value === value);
          if (!exists) {
            list.push({
              id: toFilterId(`${key}-${value}`),
              label: option.label,
              value,
            });
            byKey.set(key, list);
          }
        });
      });

      const entries = [...byKey.entries()];
      if (entries.length === 0) return null;
      if (entries.length === 1) {
        const [id, options] = entries[0];
        return { id, title: section.title, options };
      }
      return entries.map(([id, options]) => ({
        id,
        title: `${section.title}: ${id}`,
        options,
      }));
    })
    .flat()
    .filter((section): section is CatalogFilterSection => Boolean(section));
}

export function buildStrapiFiltersFromCatalog(
  filters: Record<string, string[]>
): Record<string, string> {
  const params: Record<string, string> = {};

  const addInFilter = (basePath: string, values: string[]) => {
    values.forEach((value, index) => {
      params[`${basePath}[$in][${index}]`] = value;
    });
  };

  for (const [key, values] of Object.entries(filters)) {
    if (values.length === 0) continue;

    switch (key) {
      case "color":
        addInFilter("filters[colors][name]", values);
        break;
      case "size":
        addInFilter("filters[sizes][value]", values);
        break;
      case "fabric":
        params["filters[composition][$containsi]"] = values[0];
        break;
      case "density":
        params["filters[specifications][value][$containsi]"] = values[0];
        break;
      case "priceFrom":
        params["filters[price][$gte]"] = values[0];
        break;
      case "priceTo":
        params["filters[price][$lte]"] = values[0];
        break;
      case "inStock":
        if (values[0] === "true" || values[0] === "false") {
          params["filters[inStock][$eq]"] = values[0];
        }
        break;
      case "promo":
        if (values.includes("special") || values.includes("sale")) {
          params["filters[oldPrice][$notNull]"] = "true";
        }
        break;
      default:
        addInFilter(`filters[${key}]`, values);
        break;
    }
  }

  return params;
}

export function stringifyCatalogQuery(
  state: Pick<CatalogSearchState, "sort" | "page" | "pageSize" | "filters">
): string {
  const params = new URLSearchParams();
  if (state.sort !== "popular") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));
  if (state.pageSize !== 24) params.set("pageSize", String(state.pageSize));

  Object.entries(state.filters).forEach(([key, values]) => {
    values.forEach((value) => params.append(key, value));
  });

  return params.toString();
}
