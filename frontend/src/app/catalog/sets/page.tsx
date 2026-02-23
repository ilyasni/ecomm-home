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
import { setProducts } from "@/data/sets";
import type { Product } from "@/components/catalog/ProductCard";
import { FiltersPanel } from "@/components/catalog/FiltersPanel";
import { QuickViewModal } from "@/components/catalog/QuickViewModal";

export default function SetsCatalogPage() {
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
    console.log("Add to favorites:", id);
  };

  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
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
      <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px]">
        <div className="px-4 md:px-[39px] desktop:px-0">
          <div className="mx-auto max-w-[1400px] pt-4 desktop:pt-6">
            <Breadcrumbs items={breadcrumbs} className="mb-4 desktop:mb-[32px]" />

            <CatalogHeader title="Собери свой комплект" count={setProducts.length} />

            <div className="hidden md:block mt-4 md:mt-6">
              <CatalogSort value={sortValue} onChange={handleSortChange} />
            </div>

            <div className="hidden desktop:flex items-center justify-end mt-2">
              <GridToggle value={desktopGridColumns} onChange={setDesktopGridColumns} />
            </div>

            <div className="hidden md:block desktop:hidden mt-4">
              <MobileToolbar
                onOpenFilters={() => setFiltersOpen(true)}
                onToggleSort={() => setSortOpen(!sortOpen)}
                gridColumns={tabletGridColumns}
                onGridChange={handleTabletGridChange}
                gridOptions={[2, 3]}
              />
            </div>

            <div className="md:hidden mt-4">
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
                <CatalogSort value={sortValue} onChange={(v) => { handleSortChange(v); setSortOpen(false); }} />
              </div>
            )}

            <div className="mt-4 hidden desktop:block desktop:mt-[16px]">
              <CatalogFilters
                tags={filterTags}
                onClearAll={handleClearFilters}
                onOpenFilters={() => setFiltersOpen(true)}
              />
            </div>
          </div>
        </div>

        <div className="px-4 md:px-[39px] desktop:px-0">
          <div className="mx-auto max-w-[1400px] mt-6 desktop:mt-[24px]">
            <div className="hidden desktop:block">
              <CatalogGrid
                products={setProducts}
                onFavorite={handleFavorite}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                columns={desktopGridColumns}
              />
            </div>

            <div className="hidden md:block desktop:hidden">
              <CatalogGrid
                products={setProducts}
                onFavorite={handleFavorite}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                columns={tabletGridColumns}
              />
            </div>

            <div className="md:hidden">
              <CatalogGrid
                products={setProducts}
                onFavorite={handleFavorite}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                columns={mobileGridColumns}
              />
            </div>

            <div className="flex flex-col items-center gap-4 mt-8 desktop:mt-[45px]">
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

      <FiltersPanel
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
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
