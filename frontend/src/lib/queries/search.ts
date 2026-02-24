import { strapiSingleType, strapiFind } from "@/lib/strapi";

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

export async function searchProducts(query: string, page = 1, pageSize = 12) {
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
  );
}
