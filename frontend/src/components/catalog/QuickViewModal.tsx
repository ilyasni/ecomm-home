"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/design-system/icons";
import { Button, Select } from "@/design-system/components";
import type { Product } from "./ProductCard";

type QuickViewModalProps = {
  product: Product;
  onClose: () => void;
  onAddToCart?: (id: string) => void;
};

const sizeOptions = [
  { value: "1.5", label: "1,5 сп" },
  { value: "2", label: "2 сп" },
  { value: "euro", label: "Евро" },
  { value: "family", label: "Семейный" },
];

/** Максимум строк описания в быстром просмотре */
const DESCRIPTION_CLAMP = 4;

export function QuickViewModal({ product, onClose, onAddToCart }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const isLongDescription = product.description && product.description.length > 200;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/*
        desktop: flex-row, изображение 480px фиксированное, контент прокручивается
        mobile:  flex-col, изображение 3/2 (не занимает весь экран), контент прокручивается
        max-h-[90dvh] — не выходит за экран на любом устройстве
      */}
      <div className="desktop:flex-row relative z-10 flex max-h-[90dvh] w-full max-w-[1305px] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Изображение */}
        <div className="desktop:w-[480px] desktop:aspect-square desktop:shrink-0 relative aspect-[3/2] w-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              type="button"
              className="group flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--color-brown)]"
              aria-label="Добавить в избранное"
            >
              <span className="group-hover:hidden">
                <Icon name="favorite" size={18} />
              </span>
              <span className="hidden group-hover:block">
                <Icon name="favoriteFilled" size={18} />
              </span>
            </button>
            <button
              type="button"
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--color-brown)] transition-opacity hover:opacity-80"
              aria-label="Сертификат качества"
            >
              <Icon name="diamond" size={18} />
            </button>
          </div>
        </div>

        {/* Контент — прокручивается независимо от высоты */}
        <div className="desktop:flex-1 desktop:p-10 relative flex flex-col overflow-y-auto p-6">
          {/* Кнопка закрыть — в контентной панели, не пересекается с кнопками на фото */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex items-center justify-center transition-opacity hover:opacity-70"
            aria-label="Закрыть"
          >
            <Icon name="close" size={24} />
          </button>

          {product.sku && (
            <p className="text-sm text-[var(--color-gray)]">Артикул: {product.sku}</p>
          )}
          <h2 className="desktop:text-[32px] mt-2 text-2xl leading-tight font-medium">
            {product.title}
          </h2>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="desktop:text-2xl text-xl font-medium">{product.price}</span>
            {product.oldPrice && (
              <span className="text-base text-[var(--color-gray)] line-through">
                {product.oldPrice}
              </span>
            )}
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-4">
              <p className="text-sm">
                <span className="text-[var(--color-gray)]">Цвет: </span>
                <span>{product.colors[0].name}</span>
              </p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className="h-[22px] w-[22px] rounded-full border border-[var(--color-gray-light)]"
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-[var(--color-gray)]">
                Оттенок на сайте может отличаться.{" "}
                <span className="cursor-pointer underline">Подробнее</span>
              </p>
            </div>
          )}

          {product.description && (
            <div className="mt-4">
              <p
                className={`text-sm leading-relaxed text-[var(--color-dark-gray)] ${
                  !descExpanded ? `line-clamp-${DESCRIPTION_CLAMP}` : ""
                }`}
              >
                {product.description}
              </p>
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setDescExpanded((prev) => !prev)}
                  className="mt-1 text-xs text-[var(--color-gray)] underline hover:opacity-70"
                >
                  {descExpanded ? "Свернуть" : "Читать далее"}
                </button>
              )}
            </div>
          )}

          <div className="mt-6">
            <Select
              options={sizeOptions}
              placeholder="Размер"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              fullWidth
            />
          </div>

          <div className="mt-4 space-y-3">
            <Button variant="primary" fullWidth onClick={() => onAddToCart?.(product.id)}>
              В корзину
            </Button>
            <Button variant="secondary" fullWidth>
              Быстрый заказ
            </Button>
          </div>

          <Link
            href={`/catalog/${product.slug ?? product.id}`}
            className="mt-4 block text-center text-sm text-[var(--color-dark-gray)] underline transition-opacity hover:opacity-70"
          >
            Больше информации о товаре
          </Link>
        </div>
      </div>
    </div>
  );
}
