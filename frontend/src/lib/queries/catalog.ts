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

/** Общие параметры populate для медиа-полей продукта (обложка + цвета) */
const PRODUCT_LIST_POPULATE: Record<string, string> = {
  "populate[image][fields][0]": "url",
  "populate[image][fields][1]": "width",
  "populate[image][fields][2]": "height",
  "populate[image][fields][3]": "formats",
  "populate[image][fields][4]": "alternativeText",
  "populate[colors]": "*",
};

/** Populate для страницы продукта: обложка + галерея + характеристики */
const PRODUCT_DETAIL_POPULATE: Record<string, string> = {
  "populate[image][fields][0]": "url",
  "populate[image][fields][1]": "width",
  "populate[image][fields][2]": "height",
  "populate[image][fields][3]": "formats",
  "populate[image][fields][4]": "alternativeText",
  "populate[gallery][fields][0]": "url",
  "populate[gallery][fields][1]": "width",
  "populate[gallery][fields][2]": "height",
  "populate[gallery][fields][3]": "formats",
  "populate[gallery][fields][4]": "alternativeText",
  "populate[colors]": "*",
  "populate[sizes]": "*",
  "populate[specifications]": "*",
  "populate[sizeChart]": "*",
  "populate[setItems][populate]": "*",
  "populate[category][fields][0]": "title",
  "populate[category][fields][1]": "slug",
};

export async function getCategories() {
  return strapiFind(
    "categories",
    {
      "populate[image][fields][0]": "url",
      "populate[image][fields][1]": "width",
      "populate[image][fields][2]": "height",
      "populate[image][fields][3]": "formats",
      "populate[image][fields][4]": "alternativeText",
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
    ...PRODUCT_LIST_POPULATE,
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
  return strapiFindBySlug("products", slug, PRODUCT_DETAIL_POPULATE, {
    revalidate: 60,
    tags: ["products"],
  });
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
    filters?: Record<string, string>;
  }
) {
  const queryParams: Record<string, string> = {
    ...PRODUCT_LIST_POPULATE,
    "filters[category][slug][$eq]": categorySlug,
    "pagination[page]": String(params?.page ?? 1),
    "pagination[pageSize]": String(params?.pageSize ?? 12),
    "sort[0]": params?.sort ?? "createdAt:desc",
  };

  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      queryParams[key] = value;
    });
  }

  return strapiFind("products", queryParams, { revalidate: 60, tags: ["products"] });
}

export async function getSetProducts(params?: {
  page?: number;
  pageSize?: number;
  sort?: string;
  filters?: Record<string, string>;
}) {
  const queryParams: Record<string, string> = {
    ...PRODUCT_LIST_POPULATE,
    "filters[productType][$eq]": "set",
    "pagination[page]": String(params?.page ?? 1),
    "pagination[pageSize]": String(params?.pageSize ?? 12),
    "sort[0]": params?.sort ?? "createdAt:desc",
  };

  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      queryParams[key] = value;
    });
  }

  return strapiFind("products", queryParams, { revalidate: 60, tags: ["products"] });
}
