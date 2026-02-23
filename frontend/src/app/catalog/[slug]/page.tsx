"use client";

import { use } from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { GiftCertificateInfo } from "@/components/product/GiftCertificateInfo";
import { RecommendationsSlider } from "@/components/product/RecommendationsSlider";
import { catalogProducts } from "@/data/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProductPage({ params }: PageProps) {
  const { slug } = use(params);

  const product = catalogProducts.find((p) => p.id === slug) || catalogProducts[0];

  const images = Array(9).fill(product.image);

  const isGiftCert = product.type === "giftCertificate";

  const breadcrumbs = isGiftCert
    ? [
        { label: "Главная", href: "/" },
        { label: "Подарочный сертификат" },
      ]
    : [
        { label: "Главная", href: "/" },
        { label: "Постельное бельё", href: "/catalog" },
        { label: product.title },
      ];

  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
  };

  const handleFavorite = (id: string) => {
    console.log("Add to favorites:", id);
  };

  const recommended = catalogProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const recentlyViewed = catalogProducts.slice(0, 4);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px]">
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
      </main>
      <Footer />
    </div>
  );
}
