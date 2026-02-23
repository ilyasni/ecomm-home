import { strapiFind, strapiFindBySlug } from "@/lib/strapi";

export async function getCategories() {
  return strapiFind("categories", {
    "populate[image]": "*",
    "populate[subcategories]": "*",
    "sort[0]": "order:asc",
  }, { revalidate: 120, tags: ["categories"] });
}

export async function getProducts(params?: {
  page?: number;
  pageSize?: number;
  sort?: string;
  filters?: Record<string, string>;
}) {
  const queryParams: Record<string, string> = {
    "populate[image]": "*",
    "populate[colors]": "*",
    "pagination[page]": String(params?.page ?? 1),
    "pagination[pageSize]": String(params?.pageSize ?? 12),
    "sort[0]": params?.sort ?? "createdAt:desc",
  };

  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      queryParams[key] = value;
    });
  }

  return strapiFind("products", queryParams, {
    revalidate: 60,
    tags: ["products"],
  });
}

export async function getProductBySlug(slug: string) {
  return strapiFindBySlug("products", slug, {
    "populate[image]": "*",
    "populate[colors]": "*",
    "populate[setItems][populate]": "*",
    "populate[gallery]": "*",
  }, { revalidate: 60, tags: ["products"] });
}

export async function getSetProducts(params?: {
  page?: number;
  pageSize?: number;
  sort?: string;
}) {
  return strapiFind("products", {
    "filters[type][$eq]": "set",
    "populate[image]": "*",
    "populate[colors]": "*",
    "pagination[page]": String(params?.page ?? 1),
    "pagination[pageSize]": String(params?.pageSize ?? 12),
    "sort[0]": params?.sort ?? "createdAt:desc",
  }, { revalidate: 60, tags: ["products"] });
}
