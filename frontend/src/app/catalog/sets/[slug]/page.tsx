import { SetProductClient } from "./SetProductClient";
import { getProductBySlug, getProducts } from "@/lib/queries/catalog";
import { withFallback } from "@/lib/with-fallback";
import { mapMedia, mapMediaArray, formatPrice } from "@/lib/mappers";
import { setProducts, getSetItems } from "@/data/sets";
import { catalogProducts as fallbackCatalog } from "@/data/catalog";
import type { Product } from "@/components/catalog/ProductCard";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function mapStrapiProduct(p: Record<string, unknown>): Product {
  return {
    id: (p.documentId as string) ?? String(p.id),
    title: p.title as string,
    description: (p.description as string) ?? undefined,
    price: formatPrice(p.price as number),
    oldPrice: p.oldPrice ? formatPrice(p.oldPrice as number) : undefined,
    image: p.image
      ? (mapMedia(p.image as never) ?? "/assets/figma/placeholder.svg")
      : "/assets/figma/placeholder.svg",
    badge: (p.badge as string) ?? undefined,
    rating: (p.rating as number) ?? undefined,
    sku: (p.sku as string) ?? undefined,
    colors: (p.colors as Product["colors"]) ?? undefined,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await withFallback(async () => {
    const res = await getProductBySlug(slug);
    return res.data as Record<string, unknown>;
  }, null);

  const title =
    (data?.title as string) ?? setProducts.find((p) => p.id === slug)?.title ?? "Комплект";

  return {
    title,
    description: `${title} — Vita Brava Home`,
  };
}

export default async function SetProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await withFallback<Product>(
    async () => {
      const res = await getProductBySlug(slug);
      return mapStrapiProduct(res.data as unknown as Record<string, unknown>);
    },
    setProducts.find((p) => p.id === slug) ?? setProducts[0]
  );

  const setItems = getSetItems(slug);

  const gallery = await withFallback<string[]>(async () => {
    const res = await getProductBySlug(slug);
    const data = res.data as Record<string, unknown>;
    if (data.gallery) {
      return mapMediaArray(data.gallery as never);
    }
    return Array(9).fill(product.image);
  }, Array(9).fill(product.image));

  const recommended = await withFallback<Product[]>(
    async () => {
      const res = await getProducts({ pageSize: 4 });
      return (res.data as unknown as Record<string, unknown>[])
        .filter((p) => (p.documentId ?? p.id) !== slug)
        .slice(0, 4)
        .map(mapStrapiProduct);
    },
    fallbackCatalog.filter((p) => p.id !== product.id).slice(0, 4)
  );

  const recentlyViewed = fallbackCatalog.slice(0, 4);

  return (
    <SetProductClient
      product={product}
      setItems={setItems}
      recommended={recommended}
      recentlyViewed={recentlyViewed}
      images={gallery}
    />
  );
}
