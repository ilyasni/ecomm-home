import { strapiSingleType, strapiFind } from "@/lib/strapi";

export async function getHomePage() {
  return strapiSingleType("home-page", {
    "populate[heroSlides][populate]": "*",
    "populate[categories][populate]": "*",
    "populate[hits][populate]": "*",
    "populate[budgetCollections][populate]": "*",
    "populate[advantages]": "*",
    "populate[advantageImages]": "*",
    "populate[feedbacks][populate]": "*",
  }, { revalidate: 60, tags: ["home"] });
}

export async function getHomeNews() {
  return strapiFind("articles", {
    "sort[0]": "date:desc",
    "pagination[limit]": "4",
    "populate": "*",
  }, { revalidate: 60, tags: ["articles"] });
}
