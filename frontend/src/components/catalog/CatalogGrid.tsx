"use client";

import { ProductCard, type Product } from "./ProductCard";

type CatalogGridProps = {
  products: Product[];
  onFavorite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  onQuickView?: (product: Product) => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
};

export function CatalogGrid({
  products,
  onFavorite,
  onAddToCart,
  onQuickView,
  columns = 3,
  className,
}: CatalogGridProps) {
  const gridCols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2 gap-x-1",
    3: "grid-cols-3 gap-x-2",
    4: "grid-cols-4 gap-x-2",
  };

  const cardVariant =
    columns === 4 ? "medium" :
    columns === 3 ? "medium" :
    columns === 2 ? "large" :
    "large";

  return (
    <div className={`grid gap-y-6 ${gridCols[columns]} ${className || ""}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={cardVariant}
          onFavorite={onFavorite}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}
