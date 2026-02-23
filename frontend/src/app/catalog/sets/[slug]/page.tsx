"use client";

import { use, useState } from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { SetCollectionCards } from "@/components/product/SetCollectionCards";
import { CollectionCartModal } from "@/components/product/CollectionCartModal";
import { RecommendationsSlider } from "@/components/product/RecommendationsSlider";
import { setProducts, getSetItems } from "@/data/sets";
import { catalogProducts } from "@/data/catalog";
import { Button } from "@/design-system/components";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function SetProductPage({ params }: PageProps) {
  const { slug } = use(params);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);

  const product = setProducts.find((p) => p.id === slug) || setProducts[0];
  const setItems = getSetItems(product.id);

  const images = Array(9).fill(product.image);

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Постельное бельё", href: "/catalog" },
    { label: "Комплект постельного белья", href: "/catalog/sets" },
    { label: product.title },
  ];

  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
  };

  const handleSetItemAddToCart = (id: string, size: string) => {
    console.log("Add set item to cart:", id, "size:", size);
  };

  const handleFavorite = (id: string) => {
    console.log("Add to favorites:", id);
  };

  const recommended = catalogProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const recentlyViewed = catalogProducts.slice(0, 4);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px] pb-[77px] md:pb-0">
        <div className="px-4 md:px-[39px] desktop:px-0">
          <div className="mx-auto max-w-[1400px] pt-4 md:pt-6 desktop:pt-8">
            <div className="flex items-center justify-between mb-6">
              <Breadcrumbs items={breadcrumbs} />
            </div>

            <div className="flex flex-col gap-8 desktop:flex-row desktop:gap-[30px]">
              <ProductGallery
                images={images}
                title={product.title}
                onFavorite={() => handleFavorite(product.id)}
                className="desktop:w-[804px] desktop:shrink-0"
              />

              <div className="desktop:flex-1 desktop:max-w-[566px]">
                <ProductInfo
                  product={product}
                  onAddToCart={handleAddToCart}
                />

                <SetCollectionCards
                  items={setItems}
                  onAddToCart={handleSetItemAddToCart}
                  onBuyCollection={() => setCollectionModalOpen(true)}
                  className="mt-10 desktop:mt-12"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-[39px] desktop:px-0">
          <div className="mx-auto max-w-[1400px]">
            <RecommendationsSlider
              title="С этим товаром покупают"
              products={recommended}
              onFavorite={handleFavorite}
              onAddToCart={handleAddToCart}
              className="mt-12 desktop:mt-[80px]"
            />

            <RecommendationsSlider
              title="Ранее вы смотрели"
              products={recentlyViewed}
              onFavorite={handleFavorite}
              onAddToCart={handleAddToCart}
              className="mt-12 desktop:mt-[80px] mb-12 desktop:mb-[80px]"
            />
          </div>
        </div>

        {/* Mobile sticky "В корзину" */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--background)] px-4 py-4 border-t border-[var(--color-gray-light)] md:hidden">
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleAddToCart(product.id)}
          >
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
