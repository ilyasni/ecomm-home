import { strapiFind, strapiFindBySlug } from "@/lib/strapi";

export async function getArticles(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
}) {
  const queryParams: Record<string, string> = {
    "populate[image]": "*",
    "sort[0]": "date:desc",
    "pagination[page]": String(params?.page ?? 1),
    "pagination[pageSize]": String(params?.pageSize ?? 10),
  };

  if (params?.category && params.category !== "все") {
    queryParams["filters[category][$eq]"] = params.category;
  }

  return strapiFind("articles", queryParams, {
    revalidate: 60,
    tags: ["articles"],
  });
}

export async function getArticleBySlug(slug: string) {
  return strapiFindBySlug("articles", slug, {
    "populate[image]": "*",
    "populate[toc]": "*",
    "populate[sections][on][article.section-heading][populate]": "*",
    "populate[sections][on][article.section-text][populate]": "*",
    "populate[sections][on][article.section-list][populate]": "*",
    "populate[sections][on][article.section-images][populate]": "*",
    "populate[sections][on][article.section-table][populate]": "*",
  }, { revalidate: 60, tags: ["articles"] });
}
