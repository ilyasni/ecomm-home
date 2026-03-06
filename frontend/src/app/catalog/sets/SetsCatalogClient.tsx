"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { CatalogSort } from "@/components/catalog/CatalogSort";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { GridToggle } from "@/components/catalog/GridToggle";
import { MobileToolbar } from "@/components/catalog/MobileToolbar";
import { Pagination } from "@/components/catalog/Pagination";
import { Button } from "@/design-system/components";
import type { Product } from "@/components/catalog/ProductCard";
import { FiltersPanel } from "@/components/catalog/FiltersPanel";
import { QuickViewModal } from "@/components/catalog/QuickViewModal";
import type { CatalogSortValue } from "@/lib/catalog-filters";
import { buildCatalogQueryFromBase } from "@/lib/catalog-url-state";
import { addToCart, toggleFavorite } from "@/lib/commerce";
import { mapProductToCommerceRef } from "@/lib/commerce/mappers";

type SetsCatalogClientProps = {
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
  pageSize: number;
  sortValue: CatalogSortValue;
  activeFilters: Record<string, string[]>;
};

export function SetsCatalogClient({
  products,
  totalCount,
  page,
  totalPages,
  pageSize,
  sortValue,
  activeFilters,
}: SetsCatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [desktopGridColumns, setDesktopGridColumns] = useState<3 | 4>(3);
  const [tabletGridColumns, setTabletGridColumns] = useState<2 | 3>(2);
  const [mobileGridColumns, setMobileGridColumns] = useState<1 | 2>(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Постельное бельё", href: "/catalog" },
    { label: "Собери свой комплект" },
  ];

  const normalize = (value: string) => value.toLowerCase().trim();
  const activeFilterEntries = Object.entries(activeFilters).filter(
    ([, values]) => values.length > 0
  );
  const hasActiveFilters = activeFilterEntries.length > 0;

  const filteredProducts = hasActiveFilters
    ? products.filter((product) => {
        const haystack = normalize([product.title, product.description].filter(Boolean).join(" "));

        return activeFilterEntries.every(([key, values]) => {
          const needles = values.map(normalize);

          switch (key) {
            case "color": {
              const colors = (product.colors ?? []).map((item) => normalize(item.name));
              return needles.some((needle) => colors.some((color) => color.includes(needle)));
            }
            case "promo": {
              return needles.some((needle) => {
                if (needle === "sale" || needle === "special") return Boolean(product.oldPrice);
                if (needle === "new") return normalize(product.badge ?? "").includes("нов");
                return false;
              });
            }
            case "size":
            case "fabric":
            case "density":
              return needles.some((needle) => haystack.includes(needle));
            default:
              return needles.some((needle) => haystack.includes(needle));
          }
        });
      })
    : products;

  const visibleProducts = filteredProducts;
  const visibleTotal = hasActiveFilters ? visibleProducts.length : totalCount;

  const pushState = (next: {
    sort?: CatalogSortValue;
    page?: number;
    filters?: Record<string, string[]>;
  }) => {
    const query = buildCatalogQueryFromBase({
      base: new URLSearchParams(searchParams.toString()),
      sort: next.sort ?? sortValue,
      page: next.page ?? page,
      pageSize,
      filters: next.filters ?? activeFilters,
    });
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const filterTags = Object.entries(activeFilters).flatMap(([key, values]) =>
    values.map((value) => ({
      id: `${key}:${value}`,
      label: value,
      onRemove: () => {
        const next = { ...activeFilters };
        next[key] = (next[key] ?? []).filter((item) => item !== value);
        if (next[key].length === 0) delete next[key];
        pushState({ page: 1, filters: next });
      },
    }))
  );

  const handleSortChange = (value: string) => {
    pushState({ sort: value as CatalogSortValue, page: 1 });
  };

  const handleClearFilters = () => {
    pushState({ page: 1, filters: {} });
  };

  const handleFavorite = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    toggleFavorite(mapProductToCommerceRef(product));
  };

  const handleAddToCart = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    addToCart(mapProductToCommerceRef(product));
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]">
        <div className="desktop:px-0 px-4 md:px-[39px]">
          <div className="desktop:pt-6 mx-auto max-w-[1400px] pt-4">
            <Breadcrumbs items={breadcrumbs} className="desktop:mb-[32px] mb-4" />

            <CatalogHeader title="Собери свой комплект" count={visibleTotal} />

            <div className="mt-4 hidden md:mt-6 md:block">
              <CatalogSort value={sortValue} onChange={handleSortChange} />
            </div>

            <div className="desktop:flex mt-2 hidden items-center justify-end">
              <GridToggle value={desktopGridColumns} onChange={setDesktopGridColumns} />
            </div>

            <div className="desktop:hidden mt-4">
              <MobileToolbar
                onOpenFilters={() => setFiltersOpen(true)}
                onToggleSort={() => setSortOpen(!sortOpen)}
                gridColumns={tabletGridColumns}
                onGridChange={(cols) => {
                  setTabletGridColumns(Math.min(3, Math.max(2, cols)) as 2 | 3);
                  setMobileGridColumns(Math.min(2, Math.max(1, cols)) as 1 | 2);
                }}
                gridOptions={[1, 2, 3]}
              />
            </div>

            {sortOpen && (
              <div className="mt-2 md:hidden">
                <CatalogSort
                  value={sortValue}
                  onChange={(v) => {
                    handleSortChange(v);
                    setSortOpen(false);
                  }}
                />
              </div>
            )}

            <div className="desktop:mt-[16px] mt-4">
              <CatalogFilters
                tags={filterTags}
                onClearAll={handleClearFilters}
                onOpenFilters={() => setFiltersOpen(true)}
                quickFilterValues={["sale", "new", "special"]}
                activeQuickFilterValues={activeFilters.promo ?? []}
                onToggleQuickFilter={(value) => {
                  const current = new Set(activeFilters.promo ?? []);
                  if (current.has(value)) current.delete(value);
                  else current.add(value);
                  const next = { ...activeFilters };
                  if (current.size > 0) next.promo = [...current];
                  else delete next.promo;
                  pushState({ page: 1, filters: next });
                }}
              />
            </div>
          </div>
        </div>

        <div className="desktop:px-0 px-4 md:px-[39px]">
          <div className="desktop:mt-[24px] mx-auto mt-6 max-w-[1400px]">
            {visibleProducts.length > 0 ? (
              <>
                <div className="desktop:block hidden">
                  <CatalogGrid
                    products={visibleProducts}
                    onFavorite={handleFavorite}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    columns={desktopGridColumns}
                  />
                </div>

                <div className="desktop:hidden hidden md:block">
                  <CatalogGrid
                    products={visibleProducts}
                    onFavorite={handleFavorite}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    columns={tabletGridColumns}
                  />
                </div>

                <div className="md:hidden">
                  <CatalogGrid
                    products={visibleProducts}
                    onFavorite={handleFavorite}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    columns={mobileGridColumns}
                  />
                </div>

                <div className="desktop:mt-[45px] mt-8 flex flex-col items-center gap-4">
                  <Button variant="secondary" type="button">
                    Показать еще
                  </Button>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(nextPage) => pushState({ page: nextPage })}
                    className="desktop:hidden"
                  />
                </div>
              </>
            ) : (
              <p className="mt-8 text-center text-lg text-[var(--color-dark)]">
                По выбранным параметрам товары не найдены
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <FiltersPanel
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        initialValues={activeFilters}
        onApply={(values) => {
          pushState({ page: 1, filters: values });
        }}
      />

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
