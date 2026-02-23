import { strapiSingleType, strapiFind, strapiFindBySlug } from "@/lib/strapi";

export async function getAboutPage() {
  return strapiSingleType("about-page", {
    "populate[hero][populate]": "*",
    "populate[advantages]": "*",
    "populate[advantageImages]": "*",
    "populate[history]": "*",
    "populate[whatMakesUsDifferent][populate]": "*",
    "populate[collections][populate]": "*",
    "populate[production][populate]": "*",
    "populate[creating][populate]": "*",
  }, { revalidate: 300, tags: ["about"] });
}

export async function getCooperationPage() {
  return strapiSingleType("cooperation-page", {
    "populate[hero][populate]": "*",
    "populate[partnerOfferItems]": "*",
    "populate[advantages]": "*",
    "populate[advantageImages]": "*",
  }, { revalidate: 300, tags: ["cooperation"] });
}

export async function getContactsPage() {
  return strapiSingleType("contacts-page", {
    "populate[image]": "*",
    "populate[socials]": "*",
    "populate[boutiques][populate]": "*",
  }, { revalidate: 300, tags: ["contacts"] });
}

export async function getCustomerInfoPage() {
  return strapiSingleType("customer-info-page", {
    "populate[categories][populate][cards][populate]": "*",
    "populate[categories][populate][tabs]": "*",
  }, { revalidate: 300, tags: ["customer-info"] });
}

export async function getLoyaltyPage() {
  return strapiSingleType("loyalty-page", {
    "populate[hero][populate]": "*",
    "populate[steps]": "*",
    "populate[balanceCheck][populate]": "*",
    "populate[faq]": "*",
  }, { revalidate: 300, tags: ["loyalty"] });
}

export async function getSpecialOffersPage() {
  return strapiSingleType("special-offers-page", {
    "populate[offers][populate]": "*",
    "populate[bonusSection][populate]": "*",
  }, { revalidate: 60, tags: ["special-offers"] });
}

export async function getInfoPageBySlug(slug: string) {
  return strapiFindBySlug("info-pages", slug, {
    "populate[sections]": "*",
  }, { revalidate: 300, tags: ["info-pages"] });
}

export async function getBoutiques() {
  return strapiFind("boutiques", {
    "populate[mapImage]": "*",
  }, { revalidate: 300, tags: ["boutiques"] });
}
