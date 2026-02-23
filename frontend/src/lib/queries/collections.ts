import { strapiFind, strapiFindBySlug } from "@/lib/strapi";

export async function getCollections() {
  return strapiFind("collections", {
    "populate[bannerImage]": "*",
  }, { revalidate: 120, tags: ["collections"] });
}

export async function getCollectionBySlug(slug: string) {
  return strapiFindBySlug("collections", slug, {
    "populate[heroImages]": "*",
    "populate[mediaImage]": "*",
    "populate[mediaVideo]": "*",
    "populate[bannerImage]": "*",
    "populate[products][populate][image]": "*",
    "populate[products][populate][colors]": "*",
  }, { revalidate: 60, tags: ["collections"] });
}
