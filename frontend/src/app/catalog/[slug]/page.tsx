import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getProductBySlug,
  getProducts,
  getCategoryBySlug,
  getProductsByCategory,
  getCategories,
  type StrapiFilterItem,
} from "@/lib/queries/catalog";
import { withFallback } from "@/lib/with-fallback";
import { mapMediaOrPlaceholder, mapMediaArray, formatPrice } from "@/lib/mappers";
import type { StrapiMedia } from "@/types/strapi";
import { catalogProducts } from "@/data/catalog";
import { catalogCategories } from "@/data/catalog-menu";
import type { Product } from "@/components/catalog/ProductCard";
import { ProductPageClient } from "./ProductPageClient";
import { CategoryPageClient } from "./CategoryPageClient";
import {
  buildCategoryFilterSections,
  buildStrapiFiltersFromCatalog,
  mapSortToStrapi,
  parseCatalogSearchParams,
} from "@/lib/catalog-filters";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

type StrapiEntity = Record<string, unknown>;

function normalizeText(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

async function resolveCategoryByLegacySlug(slug: string): Promise<StrapiEntity | null> {
  const legacyKeywordMap: Record<string, string[]> = {
    boudoir: ["будуар", "наряд"],
    "gift-certificates": ["сертификат", "подароч"],
    "komplekty-postelnogo-belya": ["постельн", "бель"],
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
  const image = raw.image as StrapiMedia | null | undefined;
  const gallery = raw.gallery as StrapiMedia[] | null | undefined;
  const coverUrl = mapMediaOrPlaceholder(image);
  const galleryUrls = mapMediaArray(gallery);
  const category = raw.category as { title: string; slug: string } | null | undefined;
  return {
    id: (raw.documentId as string) ?? (raw.slug as string) ?? String(raw.id),
    slug: (raw.slug as string) ?? undefined,
    title: raw.title as string,
    description: (raw.description as string) ?? "",
    price: raw.price ? formatPrice(raw.price as number) : "",
    oldPrice: raw.oldPrice ? formatPrice(raw.oldPrice as number) : undefined,
    image: coverUrl,
    images: galleryUrls.length > 0 ? [coverUrl, ...galleryUrls] : [coverUrl],
    sku: (raw.sku as string) ?? undefined,
    inStock: (raw.inStock as boolean) ?? true,
    type: ((raw.type as string) ?? (raw.productType as string) ?? "product") as Product["type"],
    colors,
    category: category ?? undefined,
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

export default async function CatalogSlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  if (slug === "komplekty-postelnogo-belya") {
    permanentRedirect("/catalog/bed-linen");
  }

  const strapiCategory = await withFallback(async () => {
    const res = await getCategoryBySlug(slug);
    return res.data as Record<string, unknown>;
  }, null);

  const localCategory = catalogCategories.find((category) => {
    const categorySlug = category.href.split("/").filter(Boolean).at(-1);
    return category.id === slug || categorySlug === slug;
  });

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

  if (strapiCategory || localCategory) {
    const categoryTitle =
      (strapiCategory?.title as string | undefined) ?? localCategory?.label ?? slug;
    const rawCategoryFilters = strapiCategory?.filters
      ? ((strapiCategory.filters as StrapiFilterItem[] | undefined) ?? []).map((item) => ({
          title: item.title,
          options: item.options,
        }))
      : ((localCategory?.filters ?? []).map((item) => ({
          title: item.title,
          options: item.options,
        })) as Array<{ title: string; options?: Array<{ label: string; href: string }> }>);

    const categoryFilterSections = buildCategoryFilterSections(rawCategoryFilters);
    const allowedFilterKeys = [
      ...categoryFilterSections.map((section) => section.id),
      "promo",
      "priceFrom",
      "priceTo",
      "inStock",
    ];
    const catalogState = parseCatalogSearchParams(rawSearchParams, allowedFilterKeys);
    const strapiFilters = buildStrapiFiltersFromCatalog(catalogState.filters);

    const categoryProducts = await withFallback(
      async () => {
        const res = await getProductsByCategory(slug, {
          page: catalogState.page,
          pageSize: catalogState.pageSize,
          sort: mapSortToStrapi(catalogState.sort),
          filters: strapiFilters,
        });

        return {
          products: (res.data as Record<string, unknown>[]).map(mapStrapiProduct),
          pagination: res.meta.pagination,
        };
      },
      null as {
        products: Product[];
        pagination?: { page: number; pageCount: number; total: number };
      } | null
    );

    const products = categoryProducts?.products ?? [];
    const total = categoryProducts?.pagination?.total ?? products.length;
    const page = categoryProducts?.pagination?.page ?? catalogState.page;
    const pageCount = categoryProducts?.pagination?.pageCount ?? 1;

    return (
      <CategoryPageClient
        title={categoryTitle}
        slug={slug}
        products={products}
        totalCount={total}
        page={page}
        totalPages={pageCount}
        pageSize={catalogState.pageSize}
        sortValue={catalogState.sort}
        activeFilters={catalogState.filters}
        filterSections={categoryFilterSections}
        quickLinks={
          strapiCategory?.subcategories
            ? ((strapiCategory.subcategories as Array<{ label: string }> | undefined) ?? [])
                .map((item) => item.label)
                .slice(0, 5)
            : (localCategory?.subcategories ?? []).map((item) => item.label).slice(0, 5)
        }
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
