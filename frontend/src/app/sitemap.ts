import type { MetadataRoute } from "next";
import { strapiFind } from "@/lib/strapi";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitabrava-home.ru";

interface StrapiSlugItem {
  slug: string;
  updatedAt?: string;
}

async function fetchSlugs(contentType: string): Promise<StrapiSlugItem[]> {
  try {
    const res = await strapiFind<StrapiSlugItem>(
      contentType,
      {
        "fields[0]": "slug",
        "fields[1]": "updatedAt",
        "pagination[pageSize]": "1000",
      },
      { revalidate: 3600 }
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles, collections, infoPages] = await Promise.all([
    fetchSlugs("products"),
    fetchSlugs("articles"),
    fetchSlugs("collections"),
    fetchSlugs("info-pages"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/catalog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/news`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contacts`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/cooperation`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/loyalty`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/special-offers`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/customer-info`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/catalog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/news/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE_URL}/collections/${c.slug}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const infoPageEntries: MetadataRoute.Sitemap = infoPages.map((p) => ({
    url: `${SITE_URL}/info/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.3,
  }));

  return [...staticPages, ...productPages, ...articlePages, ...collectionPages, ...infoPageEntries];
}
