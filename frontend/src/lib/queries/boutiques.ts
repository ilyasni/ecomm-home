import { strapiFind } from "@/lib/strapi";

export interface BoutiqueData {
  documentId: string;
  name: string;
  city: string;
  address: string;
  metro?: string | null;
  metroDetail?: string | null;
  schedule?: string | null;
  scheduleTime?: string | null;
  phone?: string | null;
  email?: string | null;
  workingHours?: string | null;
  mapImage?: { url: string } | null;
}

export async function getBoutiques() {
  return strapiFind<BoutiqueData>(
    "boutiques",
    {
      populate: "*",
      "sort[0]": "city:asc",
      "filters[publishedAt][$notNull]": "true",
    },
    { revalidate: 300, tags: ["boutiques"] }
  );
}
