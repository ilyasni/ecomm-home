import { strapiFind, strapiFindBySlug } from "@/lib/strapi";

export async function getCollections() {
  return strapiFind(
    "collections",
    {
      populate: "*",
    },
    { revalidate: 120, tags: ["collections"] }
  );
}

export async function getCollectionBySlug(slug: string) {
  return strapiFindBySlug(
    "collections",
    slug,
    {
      "populate[heroImages]": "true",
      "populate[mediaImage]": "true",
      "populate[mediaVideo]": "true",
      "populate[bannerImage]": "true",
      "populate[image]": "true",
      "populate[products][populate]": "*",
    },
    { revalidate: 60, tags: ["collections"] }
  );
}
