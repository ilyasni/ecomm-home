import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getProductBySlug,
  getProducts,
  getCategoryBySlug,
  getProductsByCategory,
  getCategories,
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

type StrapiEntity = Record<string, unknown>;

function normalizeText(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

async function resolveCategoryByLegacySlug(slug: string): Promise<StrapiEntity | null> {
  const legacyKeywordMap: Record<string, string[]> = {
    boudoir: ["будуар", "наряд"],
    "gift-certificates": ["сертификат", "подароч"],
  };

  const keywords = legacyKeywordMap[slug];
  if (!keywords) return null;

  const categories = await withFallback(async () => {
    const res = await getCategories();
    return res.data as StrapiEntity[];
  }, [] as StrapiEntity[]);

  const byKeyword = categories.find((category) => {
    const title = normalizeText(String(category.title ?? ""));
    return keywords.some((keyword) => title.includes(keyword));
  });

  return byKeyword ?? null;
}

async function resolveGiftCertificateProductSlug(): Promise<string | null> {
  const giftProducts = await withFallback(async () => {
    const res = await getProducts({
      pageSize: 1,
      filters: { "filters[productType][$eq]": "giftCertificate" },
    });
    return res.data as StrapiEntity[];
  }, [] as StrapiEntity[]);

  const slug = giftProducts[0]?.slug;
  return typeof slug === "string" && slug.length > 0 ? slug : null;
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

  const title = (data?.title as string) ?? "Товар";
  const description = (data?.description as string) ?? "";

  return {
    title,
    description: description || `${title} — купить в интернет-магазине Vita Brava Home`,
  };
}

export default async function CatalogSlugPage({ params }: PageProps) {
  const { slug } = await params;

  let strapiCategory = await withFallback(async () => {
    const res = await getCategoryBySlug(slug);
    return res.data as Record<string, unknown>;
  }, null);

  if (!strapiCategory) {
    const legacyCategory = await resolveCategoryByLegacySlug(slug);
    if (legacyCategory?.slug) {
      permanentRedirect(`/catalog/${legacyCategory.slug as string}`);
    }
  }

  if (!strapiCategory && slug === "gift-certificates") {
    const giftCertificateSlug = await resolveGiftCertificateProductSlug();
    if (giftCertificateSlug) {
      permanentRedirect(`/catalog/${giftCertificateSlug}`);
    }
  }

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
    const mockProduct = catalogProducts.find((p) => p.id === slug);
    if (process.env.NODE_ENV !== "production" && mockProduct) {
      product = mockProduct;
    } else {
      notFound();
    }
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
