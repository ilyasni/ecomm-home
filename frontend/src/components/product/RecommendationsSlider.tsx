"use client";

import { useRef } from "react";
import { ProductCard, type Product } from "@/components/catalog/ProductCard";

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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="desktop:text-[28px] text-xl font-medium md:text-[24px]">{title}</h2>
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gray-light)] transition-colors hover:bg-[var(--color-selection)]"
            aria-label="Назад"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 4L6 8L10 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gray-light)] transition-colors hover:bg-[var(--color-selection)]"
            aria-label="Вперёд"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide desktop:gap-[8px] flex gap-2 overflow-x-auto"
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
