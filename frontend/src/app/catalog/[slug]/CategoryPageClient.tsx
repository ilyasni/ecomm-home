"use client";

import { useState } from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { QuickViewModal } from "@/components/catalog/QuickViewModal";
import type { Product } from "@/components/catalog/ProductCard";
import { addToCart, toggleFavorite } from "@/lib/commerce";
import { mapProductToCommerceRef } from "@/lib/commerce/mappers";

interface CategoryPageClientProps {
  title: string;
  slug: string;
  products: Product[];
}

export function CategoryPageClient({ title, slug, products }: CategoryPageClientProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: title },
  ];

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

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]" data-category-slug={slug}>
        <div className="desktop:px-0 px-4 md:px-[39px]">
          <div className="desktop:pt-6 mx-auto max-w-[1400px] pt-4">
            <Breadcrumbs items={breadcrumbs} />

            <h1 className="desktop:text-[40px] mt-6 text-[26px] leading-[1.1] font-medium md:text-[32px]">
              {title}
            </h1>

            {products.length > 0 ? (
              <div className="desktop:mt-10 mt-8">
                <CatalogGrid
                  products={products}
                  columns={3}
                  onFavorite={handleFavorite}
                  onAddToCart={handleAddToCart}
                  onQuickView={setQuickViewProduct}
                />
              </div>
            ) : (
              <p className="mt-8 text-center text-lg text-[var(--color-dark)]">
                В этой категории пока нет товаров
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
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
