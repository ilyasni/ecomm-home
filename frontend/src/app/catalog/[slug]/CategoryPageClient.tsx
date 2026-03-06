"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { QuickViewModal } from "@/components/catalog/QuickViewModal";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { CatalogSort } from "@/components/catalog/CatalogSort";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { FiltersPanel, type FilterSectionInput } from "@/components/catalog/FiltersPanel";
import { MobileToolbar } from "@/components/catalog/MobileToolbar";
import { GridToggle } from "@/components/catalog/GridToggle";
import { Pagination } from "@/components/catalog/Pagination";
import type { Product } from "@/components/catalog/ProductCard";
import type { CatalogSortValue } from "@/lib/catalog-filters";
import { buildCatalogQueryFromBase } from "@/lib/catalog-url-state";
import { addToCart, toggleFavorite } from "@/lib/commerce";
import { mapProductToCommerceRef } from "@/lib/commerce/mappers";

interface CategoryPageClientProps {
  title: string;
  slug: string;
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
  pageSize: number;
  sortValue: CatalogSortValue;
  activeFilters: Record<string, string[]>;
  filterSections: FilterSectionInput[];
  quickLinks: string[];
}

export function CategoryPageClient({
  title,
  slug,
  products,
  totalCount,
  page,
  totalPages,
  pageSize,
  sortValue,
  activeFilters,
  filterSections,
  quickLinks,
}: CategoryPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [desktopGridColumns, setDesktopGridColumns] = useState<3 | 4>(3);
  const [tabletGridColumns, setTabletGridColumns] = useState<2 | 3>(2);
  const [mobileGridColumns, setMobileGridColumns] = useState<1 | 2>(1);

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: title },
  ];

  const optionLabelByValue = useMemo(() => {
    const entries = filterSections.flatMap((section) =>
      section.options.map((option) => [option.value, option.label] as const)
    );
    return new Map(entries);
  }, [filterSections]);

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
      label: optionLabelByValue.get(value) ?? value,
      onRemove: () => {
        const next = { ...activeFilters };
        next[key] = (next[key] ?? []).filter((item) => item !== value);
        if (next[key].length === 0) delete next[key];
        pushState({ page: 1, filters: next });
      },
    }))
  );

  const handleAddToCart = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    addToCart(mapProductToCommerceRef(product));
  };

  const handleFavorite = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    toggleFavorite(mapProductToCommerceRef(product));
  };

  const handleQuickFilterToggle = (value: string) => {
    const current = new Set(activeFilters.promo ?? []);
    if (current.has(value)) current.delete(value);
    else current.add(value);

    const nextFilters = { ...activeFilters };
    if (current.size > 0) nextFilters.promo = [...current];
    else delete nextFilters.promo;

    pushState({ page: 1, filters: nextFilters });
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]" data-category-slug={slug}>
        <div className="desktop:px-0 px-4 md:px-[39px]">
          <div className="desktop:pt-6 mx-auto max-w-[1400px] pt-4">
            <Breadcrumbs items={breadcrumbs} />

            <div className="mt-6">
              <CatalogHeader title={title} count={totalCount} />
            </div>

            <div className="mt-4 hidden md:mt-6 md:block">
              <CatalogSort
                value={sortValue}
                onChange={(value) => pushState({ sort: value as CatalogSortValue, page: 1 })}
              />
            </div>

            <div className="desktop:flex mt-2 hidden items-center justify-end">
              <GridToggle value={desktopGridColumns} onChange={setDesktopGridColumns} />
            </div>

            <div className="desktop:hidden mt-4">
              <MobileToolbar
                onOpenFilters={() => setFiltersOpen(true)}
                onToggleSort={() => setSortOpen((prev) => !prev)}
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
                  onChange={(value) => {
                    pushState({ sort: value as CatalogSortValue, page: 1 });
                    setSortOpen(false);
                  }}
                />
              </div>
            )}

            <div className="mt-4">
              <CatalogFilters
                tags={filterTags}
                onClearAll={
                  filterTags.length > 0 ? () => pushState({ page: 1, filters: {} }) : undefined
                }
                onOpenFilters={() => setFiltersOpen(true)}
                quickFilterValues={["sale", "new", "special"]}
                activeQuickFilterValues={activeFilters.promo ?? []}
                onToggleQuickFilter={handleQuickFilterToggle}
              />
            </div>
          </div>
        </div>

        <div className="desktop:px-0 px-4 md:px-[39px]">
          <div className="desktop:mt-6 mx-auto mt-6 max-w-[1400px]">
            {products.length > 0 ? (
              <>
                <div className="desktop:block hidden">
                  <CatalogGrid
                    products={products}
                    columns={desktopGridColumns}
                    onFavorite={handleFavorite}
                    onAddToCart={handleAddToCart}
                    onQuickView={setQuickViewProduct}
                  />
                </div>
                <div className="desktop:hidden hidden md:block">
                  <CatalogGrid
                    products={products}
                    columns={tabletGridColumns}
                    onFavorite={handleFavorite}
                    onAddToCart={handleAddToCart}
                    onQuickView={setQuickViewProduct}
                  />
                </div>
                <div className="md:hidden">
                  <CatalogGrid
                    products={products}
                    columns={mobileGridColumns}
                    onFavorite={handleFavorite}
                    onAddToCart={handleAddToCart}
                    onQuickView={setQuickViewProduct}
                  />
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center pb-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={(value) => pushState({ page: value })}
                    />
                  </div>
                )}
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
        onApply={(values) => pushState({ page: 1, filters: values })}
        sections={filterSections}
        quickLinks={quickLinks}
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
