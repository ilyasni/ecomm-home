import type { Metadata } from "next";
import Link from "next/link";
import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import type { Product } from "@/components/catalog/ProductCard";
import { searchProducts } from "@/lib/queries/search";
import { withFallback } from "@/lib/with-fallback";
import { formatPrice, mapMediaOrPlaceholder } from "@/lib/mappers";

export const metadata: Metadata = {
  title: "Поиск",
  description: "Поиск товаров Vita Brava Home",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

function mapResult(raw: Record<string, unknown>): Product {
  return {
    id: (raw.documentId as string) ?? String(raw.id),
    slug: (raw.slug as string) ?? undefined,
    title: (raw.title as string) ?? "Товар",
    description: (raw.description as string) ?? "",
    price: raw.price ? formatPrice(raw.price as number) : "0 ₽",
    oldPrice: raw.oldPrice ? formatPrice(raw.oldPrice as number) : undefined,
    image: mapMediaOrPlaceholder(raw.image as never),
    badge: (raw.badge as string) ?? undefined,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const data = query
    ? await withFallback(async () => {
        const response = await searchProducts(query, 1, 24);
        return response.data as Record<string, unknown>[];
      }, [])
    : [];

  const products = data.map(mapResult);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer variant="solid" />
      <main className="pt-[111px] md:pt-[143px]">
        <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 pb-12 md:px-[39px] md:pb-20">
          <h1 className="mb-6 text-center text-[28px] leading-[1.2] font-medium md:mb-8 md:text-[36px]">
            Поиск товаров
          </h1>
          <form className="mb-8" action="/search">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Введите название, артикул или ключевое слово"
              className="w-full rounded-[5px] border border-[var(--color-gray-light)] px-4 py-3"
            />
          </form>

          {query.length === 0 ? (
            <p className="text-center text-[var(--color-dark)]">
              Введи запрос, чтобы найти товары.
            </p>
          ) : products.length === 0 ? (
            <p className="text-center text-[var(--color-dark)]">
              По запросу <strong>{query}</strong> ничего не найдено.{" "}
              <Link href="/catalog" className="underline">
                Перейти в каталог
              </Link>
              .
            </p>
          ) : (
            <>
              <p className="mb-6 text-[var(--color-dark)]">
                Найдено: <strong>{products.length}</strong>
              </p>
              <CatalogGrid products={products} columns={3} />
            </>
          )}
        </div>
      </main>
      <FooterServer />
    </div>
  );
}
