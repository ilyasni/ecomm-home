"use client";

import Image from "next/image";
import { Badge } from "@/design-system/components";
import { Icon } from "@/design-system/icons";

export type Product = {
  id: string;
  title: string;
  description?: string;
  price: string;
  oldPrice?: string;
  image: string;
  badge?: string;
  rating?: number;
  colors?: Array<{ name: string; hex: string }>;
  sku?: string;
  inStock?: boolean;
  type?: "product" | "giftCertificate";
  subtitle?: string;
  giftCertDescription?: string;
};

type ProductCardProps = {
  product: Product;
  onFavorite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  onQuickView?: (product: Product) => void;
  variant?: "large" | "medium" | "compact";
  className?: string;
};

export function ProductCard({
  product,
  onFavorite,
  onAddToCart,
  onQuickView,
  variant = "large",
  className,
}: ProductCardProps) {
  const imageHeight: Record<string, string> = {
    large: "aspect-[343/351]",
    medium: "aspect-square",
    compact: "aspect-[167/200]",
  };

  return (
    <article className={`group ${className || ""}`}>
      <div className={`relative w-full overflow-hidden ${imageHeight[variant]}`}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
        {product.badge && (
          <div className="absolute left-3 top-3">
            <Badge
              label={product.badge}
              tone={product.badge.includes("%") ? "sale" : "exclusive"}
              size={variant === "compact" ? "mobile" : "desktop"}
            />
          </div>
        )}
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={() => onFavorite?.(product.id)}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[var(--color-brown)] hover:opacity-80 transition-opacity"
            aria-label="Добавить в избранное"
          >
            <Icon name="favorite" size={18} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => onAddToCart?.(product.id)}
          className="absolute bottom-3 right-3 flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[var(--color-light)] hover:opacity-80 transition-opacity"
          aria-label="Добавить в корзину"
        >
          <Icon name="bag" size={18} />
        </button>
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[var(--color-light)] text-[var(--color-dark-gray)] px-6 py-3 rounded-[5px] text-sm whitespace-nowrap hidden desktop:flex items-center justify-center"
          >
            Быстрый просмотр
          </button>
        )}
      </div>
      <div className="mt-2 space-y-1 desktop:mt-3 desktop:space-y-2">
        <h3 className={`font-medium leading-[1.1] ${
          variant === "compact" ? "text-[14px]" : "text-[14px] md:text-[16px]"
        }`}>
          {product.title}
        </h3>
        {product.description && (
          <p className={`text-[var(--color-dark)] line-clamp-1 leading-[1.3] ${
            variant === "compact" ? "text-[12px]" : "text-[14px]"
          }`}>
            {product.description}
          </p>
        )}
        <div className={`flex items-center gap-2 ${
          variant === "compact" ? "flex-col items-start gap-1" : ""
        }`}>
          <div className="flex items-center gap-2">
            <span className={`font-medium leading-[1.1] ${
              variant === "compact" ? "text-[14px]" : "text-[14px] md:text-[16px]"
            }`}>
              {product.price}
            </span>
            {product.oldPrice && (
              <span className={`text-[var(--color-brown)] line-through ${
                variant === "compact" ? "text-[12px]" : "text-[14px]"
              }`}>
                {product.oldPrice}
              </span>
            )}
          </div>
          {product.rating !== undefined && (
            <Icon
              name="rating"
              size={36}
              height={16}
              className={variant === "compact" ? "" : "ml-auto"}
              alt="Рейтинг"
            />
          )}
        </div>
      </div>
    </article>
  );
}
