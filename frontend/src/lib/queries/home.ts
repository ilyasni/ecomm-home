import { strapiSingleType, strapiFind } from "@/lib/strapi";

export async function getHomePage() {
  return strapiSingleType(
    "home-page",
    {
      "populate[heroSlides][populate]": "*",
      "populate[budgetCollections][populate]": "*",
      "populate[feedbacks][populate]": "*",
      "populate[hitTabs][populate]": "*",
      "populate[hitProducts][populate]": "*",
      "populate[featuredProduct][populate]": "*",
      "populate[advantages]": "true",
      "populate[promoBannerItems]": "true",
      "populate[advantageImages]": "true",
      "populate[certificateImage]": "true",
      "populate[partnershipImage]": "true",
      "populate[boutiquePhotos]": "true",
      "populate[boutiqueVideo]": "true",
    },
    { revalidate: 60, tags: ["home"] }
  );
}

export async function getHomeNews() {
  return strapiFind(
    "articles",
    {
      "sort[0]": "date:desc",
      "pagination[limit]": "4",
      populate: "*",
    },
    { revalidate: 60, tags: ["articles"] }
  );
}
