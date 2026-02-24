import { strapiSingleType, strapiFind, strapiFindBySlug } from "@/lib/strapi";
import type { AboutPageData } from "@/types/content-pages";

export async function getAboutPage() {
  return strapiSingleType<AboutPageData>(
    "about-page",
    {
      "populate[advantages]": "true",
      "populate[advantageImages]": "true",
      "populate[heroDesktopImage]": "true",
      "populate[heroMobileImage]": "true",
      "populate[differenceItems][populate]": "*",
      "populate[collectionPreviews][populate]": "*",
      "populate[productionSteps]": "true",
      "populate[creatingBlocks][populate]": "*",
    },
    { revalidate: 300, tags: ["about"] }
  );
}

export async function getCooperationPage() {
  return strapiSingleType(
    "cooperation-page",
    {
      "populate[heroDesktopImage]": "true",
      "populate[heroMobileImage]": "true",
      "populate[partnerOfferItems]": "true",
      "populate[advantages]": "true",
      "populate[advantageImages]": "true",
      "populate[partnershipFormImage]": "true",
    },
    { revalidate: 300, tags: ["cooperation"] }
  );
}

export async function getContactsPage() {
  return strapiSingleType(
    "contacts-page",
    {
      "populate[socials]": "true",
      "populate[image]": "true",
      "populate[boutiques][populate]": "*",
    },
    { revalidate: 300, tags: ["contacts"] }
  );
}

export async function getCustomerInfoPage() {
  return strapiSingleType(
    "customer-info-page",
    {
      "populate[categories][populate][cards][populate][link]": "*",
      "populate[categories][populate][tabs]": "*",
    },
    { revalidate: 300, tags: ["customer-info"] }
  );
}

export async function getLoyaltyPage() {
  return strapiSingleType(
    "loyalty-page",
    {
      "populate[heroImage]": "true",
      "populate[steps]": "true",
      "populate[balanceCheck][populate]": "*",
      "populate[faq]": "true",
    },
    { revalidate: 300, tags: ["loyalty"] }
  );
}

export async function getSpecialOffersPage() {
  return strapiSingleType(
    "special-offers-page",
    {
      "populate[offers][populate]": "*",
      "populate[bonusSection][populate]": "*",
    },
    { revalidate: 60, tags: ["special-offers"] }
  );
}

export async function getInfoPageBySlug(slug: string) {
  return strapiFindBySlug(
    "info-pages",
    slug,
    {
      populate: "*",
    },
    { revalidate: 300, tags: ["info-pages"] }
  );
}

export async function getBoutiques() {
  return strapiFind(
    "boutiques",
    {
      populate: "*",
    },
    { revalidate: 300, tags: ["boutiques"] }
  );
}
