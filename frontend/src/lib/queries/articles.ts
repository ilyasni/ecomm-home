import { strapiFind, strapiFindBySlug } from "@/lib/strapi";

export async function getArticles(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
}) {
  const queryParams: Record<string, string> = {
    populate: "*",
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
  return strapiFindBySlug(
    "articles",
    slug,
    {
      populate: "*",
    },
    { revalidate: 60, tags: ["articles"] }
  );
}
