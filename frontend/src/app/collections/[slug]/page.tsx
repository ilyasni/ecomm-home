import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollectionBySlug as getCollectionFromStrapi } from "@/lib/queries/collections";
import { withFallback } from "@/lib/with-fallback";
import { mapMedia, mapMediaOrPlaceholder, mapMediaArray, formatPrice } from "@/lib/mappers";
import { getCollectionBySlug as getCollectionFromMock } from "@/data/collections";
import type { Collection } from "@/data/collections";
import type { Product } from "@/components/catalog/ProductCard";
import { CollectionPageClient } from "./CollectionPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function mapStrapiCollection(raw: Record<string, unknown>): Collection {
  const products = ((raw.products as Array<Record<string, unknown>>) ?? []).map(
    (p): Product => ({
      id: (p.documentId as string) ?? String(p.id),
      title: p.title as string,
      description: (p.description as string) ?? "",
      price: p.price ? formatPrice(p.price as number) : "",
      oldPrice: p.oldPrice ? formatPrice(p.oldPrice as number) : undefined,
      image: mapMediaOrPlaceholder(p.image as never),
    })
  );

  return {
    slug: raw.slug as string,
    title: (raw.title as string) ?? "",
    heroTitle: (raw.heroTitle as string) ?? "",
    heroSubtitle: (raw.heroSubtitle as string) ?? "",
    heroImages: mapMediaArray(raw.heroImages as never),
    descriptionTitle: (raw.descriptionTitle as string) ?? "",
    descriptionParagraphs: (raw.descriptionParagraphs as string[]) ?? [],
    mediaImage: mapMediaOrPlaceholder(raw.mediaImage as never),
    mediaVideo: mapMedia(raw.mediaVideo as never) ?? "",
    bannerTitle: (raw.bannerTitle as string) ?? "",
    bannerDescription: (raw.bannerDescription as string) ?? "",
    bannerButtonLabel: (raw.bannerButtonLabel as string) ?? "",
    bannerImage: mapMediaOrPlaceholder(raw.bannerImage as never),
    products,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const data = await withFallback(async () => {
    const res = await getCollectionFromStrapi(slug);
    return res.data;
  }, null);

  const title = (data?.title as string) ?? getCollectionFromMock(slug)?.title ?? "Коллекция";

  return {
    title,
    description: `Коллекция ${title} — Vita Brava Home`,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;

  const strapiData = await withFallback(async () => {
    const res = await getCollectionFromStrapi(slug);
    return res.data as Record<string, unknown>;
  }, null);

  let collection: Collection | undefined;

  if (strapiData) {
    collection = mapStrapiCollection(strapiData);
  } else {
    collection = getCollectionFromMock(slug);
  }

  if (!collection) notFound();

  return <CollectionPageClient collection={collection} />;
}
