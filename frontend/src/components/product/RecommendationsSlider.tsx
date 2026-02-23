"use client";

import { useRef } from "react";
import { ProductCard, type Product } from "@/components/catalog/ProductCard";
import { SliderButtons } from "@/design-system/components";

type RecommendationsSliderProps = {
  title: string;
  products: Product[];
  onFavorite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  className?: string;
};

export function RecommendationsSlider({
  title,
  products,
  onFavorite,
  onAddToCart,
  className,
}: RecommendationsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 360;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className={`${className || ""}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium md:text-[24px] desktop:text-[28px]">{title}</h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gray-light)] hover:bg-[var(--color-selection)] transition-colors"
            aria-label="Назад"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gray-light)] hover:bg-[var(--color-selection)] transition-colors"
            aria-label="Вперёд"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide desktop:gap-[8px]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="w-[260px] shrink-0 md:w-[344px]">
            <ProductCard
              product={product}
              variant="medium"
              onFavorite={onFavorite}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
