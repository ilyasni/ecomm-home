import { strapiFind, strapiFindBySlug } from "@/lib/strapi";

export interface StrapiSubcategoryItem {
  label: string;
  href: string;
}

export interface StrapiFilterOption {
  label: string;
  href: string;
}

export interface StrapiFilterItem {
  title: string;
  options: StrapiFilterOption[];
}

export interface StrapiCategoryRaw {
  documentId: string;
  slug: string;
  title: string;
  icon?: string;
  sortOrder?: number;
  subcategories?: StrapiSubcategoryItem[];
  filters?: StrapiFilterItem[];
}

export async function getCategories() {
  return strapiFind(
    "categories",
    {
      "populate[subcategories]": "*",
      "populate[filters][populate][options]": "*",
      "sort[0]": "sortOrder:asc",
    },
    { revalidate: 120, tags: ["categories"] }
  );
}

export async function getProducts(params?: {
  page?: number;
  pageSize?: number;
  sort?: string;
  filters?: Record<string, string>;
}) {
  const queryParams: Record<string, string> = {
    populate: "*",
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
  return strapiFindBySlug(
    "products",
    slug,
    {
      populate: "*",
    },
    { revalidate: 60, tags: ["products"] }
  );
}

export async function getCategoryBySlug(slug: string) {
  return strapiFindBySlug(
    "categories",
    slug,
    {
      populate: "*",
    },
    { revalidate: 120, tags: ["categories"] }
  );
}

export async function getProductsByCategory(
  categorySlug: string,
  params?: {
    page?: number;
    pageSize?: number;
    sort?: string;
  }
) {
  return strapiFind(
    "products",
    {
      "filters[category][slug][$eq]": categorySlug,
      populate: "*",
      "pagination[page]": String(params?.page ?? 1),
      "pagination[pageSize]": String(params?.pageSize ?? 12),
      "sort[0]": params?.sort ?? "createdAt:desc",
    },
    { revalidate: 60, tags: ["products"] }
  );
}

export async function getSetProducts(params?: { page?: number; pageSize?: number; sort?: string }) {
  return strapiFind(
    "products",
    {
      "filters[productType][$eq]": "set",
      populate: "*",
      "pagination[page]": String(params?.page ?? 1),
      "pagination[pageSize]": String(params?.pageSize ?? 12),
      "sort[0]": params?.sort ?? "createdAt:desc",
    },
    { revalidate: 60, tags: ["products"] }
  );
}
