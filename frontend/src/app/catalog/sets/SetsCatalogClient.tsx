"use client";

import { useState } from "react";
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
import { addToCart, toggleFavorite } from "@/lib/commerce";
import { mapProductToCommerceRef } from "@/lib/commerce/mappers";

type SetsCatalogClientProps = {
  products: Product[];
};

export function SetsCatalogClient({ products }: SetsCatalogClientProps) {
  const [sortValue, setSortValue] = useState("popular");
  const [desktopGridColumns, setDesktopGridColumns] = useState<3 | 4>(3);
  const [tabletGridColumns, setTabletGridColumns] = useState<2 | 3>(2);
  const [mobileGridColumns, setMobileGridColumns] = useState<1 | 2>(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTags, setFilterTags] = useState<
    Array<{ id: string; label: string; onRemove?: () => void }>
  >([]);

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Постельное бельё", href: "/catalog" },
    { label: "Собери свой комплект" },
  ];

  const handleSortChange = (value: string) => {
    setSortValue(value);
  };

  const handleClearFilters = () => {
    setFilterTags([]);
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

  const handleTabletGridChange = (cols: number) => {
    setTabletGridColumns(cols as 2 | 3);
  };

  const handleMobileGridChange = (cols: number) => {
    setMobileGridColumns(cols as 1 | 2);
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]">
        <div className="desktop:px-0 px-4 md:px-[39px]">
          <div className="desktop:pt-6 mx-auto max-w-[1400px] pt-4">
            <Breadcrumbs items={breadcrumbs} className="desktop:mb-[32px] mb-4" />

            <CatalogHeader title="Собери свой комплект" count={products.length} />

            <div className="mt-4 hidden md:mt-6 md:block">
              <CatalogSort value={sortValue} onChange={handleSortChange} />
            </div>

            <div className="desktop:flex mt-2 hidden items-center justify-end">
              <GridToggle value={desktopGridColumns} onChange={setDesktopGridColumns} />
            </div>

            <div className="desktop:hidden mt-4 hidden md:block">
              <MobileToolbar
                onOpenFilters={() => setFiltersOpen(true)}
                onToggleSort={() => setSortOpen(!sortOpen)}
                gridColumns={tabletGridColumns}
                onGridChange={handleTabletGridChange}
                gridOptions={[2, 3]}
              />
            </div>

            <div className="mt-4 md:hidden">
              <MobileToolbar
                onOpenFilters={() => setFiltersOpen(true)}
                onToggleSort={() => setSortOpen(!sortOpen)}
                gridColumns={mobileGridColumns}
                onGridChange={handleMobileGridChange}
                gridOptions={[1, 2]}
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

            <div className="desktop:block desktop:mt-[16px] mt-4 hidden">
              <CatalogFilters
                tags={filterTags}
                onClearAll={handleClearFilters}
                onOpenFilters={() => setFiltersOpen(true)}
              />
            </div>
          </div>
        </div>

        <div className="desktop:px-0 px-4 md:px-[39px]">
          <div className="desktop:mt-[24px] mx-auto mt-6 max-w-[1400px]">
            <div className="desktop:block hidden">
              <CatalogGrid
                products={products}
                onFavorite={handleFavorite}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                columns={desktopGridColumns}
              />
            </div>

            <div className="desktop:hidden hidden md:block">
              <CatalogGrid
                products={products}
                onFavorite={handleFavorite}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                columns={tabletGridColumns}
              />
            </div>

            <div className="md:hidden">
              <CatalogGrid
                products={products}
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
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
                className="desktop:hidden"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <FiltersPanel isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />

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
