"use client";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { GiftCertificateInfo } from "@/components/product/GiftCertificateInfo";
import { RecommendationsSlider } from "@/components/product/RecommendationsSlider";
import type { Product } from "@/components/catalog/ProductCard";
import { addToCart, toggleFavorite } from "@/lib/commerce";
import { mapProductToCommerceRef } from "@/lib/commerce/mappers";

interface ProductPageClientProps {
  product: Product;
  recommended: Product[];
  recentlyViewed: Product[];
}

export function ProductPageClient({
  product,
  recommended,
  recentlyViewed,
}: ProductPageClientProps) {
  const images = product.images?.length ? product.images : [product.image];
  const isGiftCert = product.type === "giftCertificate";

  const breadcrumbs = isGiftCert
    ? [{ label: "Главная", href: "/" }, { label: "Подарочный сертификат" }]
    : [
        { label: "Главная", href: "/" },
        { label: "Каталог", href: "/catalog" },
        ...(product.category
          ? [{ label: product.category.title, href: `/catalog/${product.category.slug}` }]
          : []),
        { label: product.title },
      ];

  const handleAddToCart = (id: string) => {
    const source = [product, ...recommended, ...recentlyViewed].find((item) => item.id === id);
    if (!source) return;
    addToCart(mapProductToCommerceRef(source));
  };

  const handleFavorite = (id: string) => {
    const source = [product, ...recommended, ...recentlyViewed].find((item) => item.id === id);
    if (!source) return;
    toggleFavorite(mapProductToCommerceRef(source));
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]">
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
              {product.type === "giftCertificate" ? (
                <GiftCertificateInfo
                  product={product}
                  onAddToCart={handleAddToCart}
                  className="desktop:flex-1"
                />
              ) : (
                <ProductInfo
                  product={product}
                  onAddToCart={handleAddToCart}
                  className="desktop:flex-1"
                />
              )}
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
      </main>
      <Footer />
    </div>
  );
}
