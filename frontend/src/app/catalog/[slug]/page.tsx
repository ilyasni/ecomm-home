import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProducts,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/queries/catalog";
import { withFallback } from "@/lib/with-fallback";
import { mapMediaOrPlaceholder, formatPrice } from "@/lib/mappers";
import { catalogProducts } from "@/data/catalog";
import type { Product } from "@/components/catalog/ProductCard";
import { ProductPageClient } from "./ProductPageClient";
import { CategoryPageClient } from "./CategoryPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function mapStrapiProduct(raw: Record<string, unknown>): Product {
  const colors = (raw.colors as Array<{ name: string; hex: string }>) ?? [];
  return {
    id: (raw.documentId as string) ?? (raw.slug as string) ?? String(raw.id),
    slug: (raw.slug as string) ?? undefined,
    title: raw.title as string,
    description: (raw.description as string) ?? "",
    price: raw.price ? formatPrice(raw.price as number) : "",
    oldPrice: raw.oldPrice ? formatPrice(raw.oldPrice as number) : undefined,
    image: mapMediaOrPlaceholder(raw.image as never),
    sku: (raw.sku as string) ?? undefined,
    inStock: (raw.inStock as boolean) ?? true,
    type: ((raw.type as string) ?? (raw.productType as string) ?? "product") as Product["type"],
    colors,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const category = await withFallback(async () => {
    const res = await getCategoryBySlug(slug);
    return res.data as Record<string, unknown>;
  }, null);

  if (category) {
    const title = (category.title as string) ?? slug;
    return {
      title,
      description: (category.seoDescription as string) || `${title} — каталог Vita Brava Home`,
    };
  }

  const data = await withFallback(async () => {
    const res = await getProductBySlug(slug);
    return res.data;
  }, null);

  const title =
    (data?.title as string) ?? catalogProducts.find((p) => p.id === slug)?.title ?? "Товар";
  const description = (data?.description as string) ?? "";

  return {
    title,
    description: description || `${title} — купить в интернет-магазине Vita Brava Home`,
  };
}

export default async function CatalogSlugPage({ params }: PageProps) {
  const { slug } = await params;

  const strapiCategory = await withFallback(async () => {
    const res = await getCategoryBySlug(slug);
    return res.data as Record<string, unknown>;
  }, null);

  if (strapiCategory) {
    const categoryProducts = await withFallback(async () => {
      const res = await getProductsByCategory(slug, { pageSize: 24 });
      return (res.data as Record<string, unknown>[]).map(mapStrapiProduct);
    }, [] as Product[]);

    return (
      <CategoryPageClient
        title={(strapiCategory.title as string) ?? slug}
        slug={slug}
        products={categoryProducts}
      />
    );
  }

  const strapiProduct = await withFallback(async () => {
    const res = await getProductBySlug(slug);
    return res.data as Record<string, unknown>;
  }, null);

  let product: Product;
  if (strapiProduct) {
    product = mapStrapiProduct(strapiProduct);
  } else {
    const mockProduct = catalogProducts.find((p) => p.id === slug) || catalogProducts[0];
    if (!mockProduct) notFound();
    product = mockProduct;
  }

  const recommendedData = await withFallback(async () => {
    const res = await getProducts({ pageSize: 4 });
    return res.data as Record<string, unknown>[];
  }, null);

  const recommended = recommendedData
    ? recommendedData
        .filter((p) => (p.slug as string) !== slug)
        .slice(0, 4)
        .map(mapStrapiProduct)
    : catalogProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const recentlyViewed = catalogProducts.slice(0, 4);

  return (
    <ProductPageClient
      product={product}
      recommended={recommended}
      recentlyViewed={recentlyViewed}
    />
  );
}
