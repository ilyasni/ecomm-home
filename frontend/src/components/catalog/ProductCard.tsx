"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/design-system/components";
import { Icon } from "@/design-system/icons";

export type Product = {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  price: string;
  oldPrice?: string;
  image: string;
  /** Полный список изображений (обложка + галерея). Используется на странице товара. */
  images?: string[];
  badge?: string;
  rating?: number;
  colors?: Array<{ name: string; hex: string }>;
  sku?: string;
  inStock?: boolean;
  type?: "product" | "giftCertificate";
  subtitle?: string;
  giftCertDescription?: string;
  category?: { title: string; slug: string };
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

  const productHref = `/catalog/${product.slug ?? product.id}`;

  return (
    // group/card — именованная группа, чтобы group-hover/card не конфликтовал
    // с вложенными group на кнопках favourite/cart
    <article className={`group/card ${className || ""}`}>
      <div className={`relative w-full overflow-hidden ${imageHeight[variant]}`}>
        {onQuickView ? (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="relative h-full w-full text-left"
            aria-label={`Быстрый просмотр: ${product.title}`}
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover/card:scale-105"
              unoptimized
            />
          </button>
        ) : (
          <Link href={productHref} aria-label={`Открыть товар: ${product.title}`}>
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover/card:scale-105"
              unoptimized
            />
          </Link>
        )}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge
              label={product.badge}
              tone={product.badge.includes("%") ? "sale" : "exclusive"}
              size={variant === "compact" ? "mobile" : "desktop"}
            />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={() => onFavorite?.(product.id)}
            className="group flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[var(--color-brown)]"
            aria-label="Добавить в избранное"
          >
            <span className="group-hover:hidden">
              <Icon name="favorite" size={18} />
            </span>
            <span className="hidden group-hover:block">
              <Icon name="favoriteFilled" size={18} />
            </span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => onAddToCart?.(product.id)}
          className="group absolute right-3 bottom-3 flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[var(--color-light)]"
          aria-label="Добавить в корзину"
        >
          <span className="group-hover:hidden">
            <Icon name="bagCard" size={18} />
          </span>
          <span className="hidden group-hover:block">
            <Icon name="bagCardHover" size={18} />
          </span>
        </button>
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="desktop:flex absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[5px] bg-[var(--color-light)] px-6 py-3 text-sm whitespace-nowrap text-[var(--color-dark-gray)] opacity-0 transition-opacity duration-200 group-hover/card:opacity-100"
          >
            Быстрый просмотр
          </button>
        )}
      </div>
      <div className="desktop:mt-3 desktop:space-y-2 mt-2 space-y-1">
        <h3
          className={`leading-[1.1] font-medium ${
            variant === "compact" ? "text-[14px]" : "text-[14px] md:text-[16px]"
          }`}
        >
          <Link href={productHref} className="hover:underline">
            {product.title}
          </Link>
        </h3>
        {product.description && (
          <p
            className={`line-clamp-1 leading-[1.3] text-[var(--color-dark)] ${
              variant === "compact" ? "text-[12px]" : "text-[14px]"
            }`}
          >
            {product.description}
          </p>
        )}
        <div
          className={`flex items-center gap-2 ${
            variant === "compact" ? "flex-col items-start gap-1" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`leading-[1.1] font-medium ${
                variant === "compact" ? "text-[14px]" : "text-[14px] md:text-[16px]"
              }`}
            >
              {product.price}
            </span>
            {product.oldPrice && (
              <span
                className={`text-[var(--color-brown)] line-through ${
                  variant === "compact" ? "text-[12px]" : "text-[14px]"
                }`}
              >
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
