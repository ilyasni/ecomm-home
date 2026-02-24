"use client";

import { useState } from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { SetCollectionCards } from "@/components/product/SetCollectionCards";
import { CollectionCartModal } from "@/components/product/CollectionCartModal";
import { RecommendationsSlider } from "@/components/product/RecommendationsSlider";
import { Button } from "@/design-system/components";
import type { Product } from "@/components/catalog/ProductCard";
import type { SetItem } from "@/data/sets";
import { addToCart, toggleFavorite } from "@/lib/commerce";
import { mapProductToCommerceRef } from "@/lib/commerce/mappers";

type SetProductClientProps = {
  product: Product;
  setItems: SetItem[];
  recommended: Product[];
  recentlyViewed: Product[];
  images: string[];
};

export function SetProductClient({
  product,
  setItems,
  recommended,
  recentlyViewed,
  images,
}: SetProductClientProps) {
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Постельное бельё", href: "/catalog" },
    { label: "Комплект постельного белья", href: "/catalog/sets" },
    { label: product.title },
  ];

  const handleAddToCart = (id: string) => {
    const source = [product, ...recommended, ...recentlyViewed].find((item) => item.id === id);
    if (!source) return;
    addToCart(mapProductToCommerceRef(source));
  };

  const handleSetItemAddToCart = (id: string, size: string) => {
    console.log("Add set item to cart:", id, "size:", size);
  };

  const handleFavorite = (id: string) => {
    const source = [product, ...recommended, ...recentlyViewed].find((item) => item.id === id);
    if (!source) return;
    toggleFavorite(mapProductToCommerceRef(source));
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] pb-[77px] md:pt-[81px] md:pb-0">
        <div className="desktop:px-0 px-4 md:px-[39px]">
          <div className="desktop:pt-8 mx-auto max-w-[1400px] pt-4 md:pt-6">
            <div className="mb-6 flex items-center justify-between">
              <Breadcrumbs items={breadcrumbs} />
            </div>

            <div className="desktop:flex-row desktop:gap-[30px] flex flex-col gap-8">
              <ProductGallery
                images={images}
                title={product.title}
                onFavorite={() => handleFavorite(product.id)}
                className="desktop:w-[804px] desktop:shrink-0"
              />

              <div className="desktop:flex-1 desktop:max-w-[566px]">
                <ProductInfo product={product} onAddToCart={handleAddToCart} />

                <SetCollectionCards
                  items={setItems}
                  onAddToCart={handleSetItemAddToCart}
                  onBuyCollection={() => setCollectionModalOpen(true)}
                  className="desktop:mt-12 mt-10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="desktop:px-0 px-4 md:px-[39px]">
          <div className="mx-auto max-w-[1400px]">
            <RecommendationsSlider
              title="С этим товаром покупают"
              products={recommended}
              onFavorite={handleFavorite}
              onAddToCart={handleAddToCart}
              className="desktop:mt-[80px] mt-12"
            />

            <RecommendationsSlider
              title="Ранее вы смотрели"
              products={recentlyViewed}
              onFavorite={handleFavorite}
              onAddToCart={handleAddToCart}
              className="desktop:mt-[80px] desktop:mb-[80px] mt-12 mb-12"
            />
          </div>
        </div>

        <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-[var(--color-gray-light)] bg-[var(--background)] px-4 py-4 md:hidden">
          <Button variant="primary" fullWidth onClick={() => handleAddToCart(product.id)}>
            В корзину
          </Button>
        </div>
      </main>
      <Footer />

      <CollectionCartModal
        open={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        items={setItems}
        recommendations={recommended}
      />
    </div>
  );
}
