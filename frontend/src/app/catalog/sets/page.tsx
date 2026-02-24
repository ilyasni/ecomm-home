import { SetsCatalogClient } from "./SetsCatalogClient";
import { getSetProducts } from "@/lib/queries/catalog";
import { withFallback } from "@/lib/with-fallback";
import { mapMedia, formatPrice } from "@/lib/mappers";
import { setProducts as mockSetProducts } from "@/data/sets";
import type { Product } from "@/components/catalog/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Собери свой комплект",
  description: "Собери свой комплект постельного белья — Vita Brava Home",
};

function mapStrapiProducts(data: Record<string, unknown>[]): Product[] {
  return data.map((p) => ({
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
  }));
}

export default async function SetsCatalogPage() {
  const productsFromApi = await withFallback<Product[]>(async () => {
    const res = await getSetProducts();
    return mapStrapiProducts(res.data as unknown as Record<string, unknown>[]);
  }, mockSetProducts);

  const products = productsFromApi.length > 0 ? productsFromApi : mockSetProducts;

  return <SetsCatalogClient products={products} />;
}
