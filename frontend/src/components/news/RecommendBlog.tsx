"use client";

import { Carousel } from "@/components/ui/Carousel";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SliderButtons } from "@/design-system/components";
import { recommendedProducts } from "@/data/news";

type RecommendBlogProps = {
  className?: string;
};

export function RecommendBlog({ className }: RecommendBlogProps) {
  const prevClass = "recommend-blog-prev";
  const nextClass = "recommend-blog-next";

  return (
    <section className={`py-6 desktop:py-8 ${className || ""}`}>
      <div className="flex items-center justify-between mb-6 desktop:mb-10">
        <h2 className="text-[20px] md:text-[28px] desktop:text-[32px] font-medium leading-[1.1]">
          Эти товары могут вас заинтересовать
        </h2>
        <SliderButtons
          prevClassName={prevClass}
          nextClassName={nextClass}
          className="hidden md:flex"
        />
      </div>
      <Carousel
        slides={recommendedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              title: product.title,
              description: product.description,
              price: product.price,
              image: product.image,
              badge: product.badge,
            }}
            variant="medium"
          />
        ))}
        slidesPerView={1.2}
        spaceBetween={8}
        showNavigation
        prevButtonClassName={prevClass}
        nextButtonClassName={nextClass}
        breakpoints={{
          768: { slidesPerView: 2.5, spaceBetween: 8 },
          1400: { slidesPerView: 4, spaceBetween: 8 },
        }}
      />
    </section>
  );
}
