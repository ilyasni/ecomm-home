"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Modal, Button, Quantity } from "@/design-system/components";
import { Icon } from "@/design-system/icons";
import { ProductCard } from "@/components/catalog/ProductCard";
import type { SetItem } from "@/data/sets";
import type { Product } from "@/components/catalog/ProductCard";

type CollectionCartItem = SetItem & {
  quantity: number;
};

type CollectionCartModalProps = {
  open: boolean;
  onClose: () => void;
  items: SetItem[];
  recommendations?: Product[];
};

function parsePrice(price: string): number {
  return parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
}

function formatPrice(value: number): string {
  return value.toLocaleString("ru-RU") + " ₽";
}

export function CollectionCartModal({
  open,
  onClose,
  items,
  recommendations = [],
}: CollectionCartModalProps) {
  const [cartItems, setCartItems] = useState<CollectionCartItem[]>(
    items.map((item) => ({ ...item, quantity: 1 }))
  );

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );

  return (
    <Modal open={open} onClose={onClose} variant="right">
      <div className="p-4 md:p-6 desktop:p-8 max-h-[100vh] overflow-y-auto">
        <h2 className="text-[18px] md:text-[22px] desktop:text-[24px] font-medium leading-[1.1] mb-6 desktop:mb-8 pr-8">
          Коллекция добавлена в корзину
        </h2>

        <div className="space-y-4 mb-4 pb-4 border-b border-[var(--color-gray-light)]">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3 desktop:gap-4">
              <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] desktop:w-[120px] desktop:h-[120px] relative shrink-0 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[14px] desktop:text-[16px] font-medium leading-[1.3]">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="text-[13px] desktop:text-[14px] text-[var(--color-dark)] mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="shrink-0 mt-0.5"
                    aria-label="В избранное"
                  >
                    <Icon name="favorite" size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <Quantity
                    value={item.quantity}
                    onChange={(val) => updateQuantity(item.id, val)}
                    min={1}
                    size="small"
                  />
                  <span className="text-[16px] desktop:text-[18px] font-medium leading-[1.1]">
                    {formatPrice(parsePrice(item.price) * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[14px] desktop:text-[16px] text-[var(--color-dark)] mb-6">
          В корзине {totalItems} товар{totalItems === 1 ? "" : totalItems < 5 ? "а" : "ов"} на сумму{" "}
          {formatPrice(totalPrice)}
        </p>

        <div className="flex flex-col md:flex-row gap-2 mb-8">
          <Link href="/cart" className="flex-1">
            <Button variant="primary" fullWidth>
              Перейти в корзину
            </Button>
          </Link>
          <Button variant="secondary" fullWidth className="flex-1" onClick={onClose}>
            Продолжить покупки
          </Button>
        </div>

        {recommendations.length > 0 && (
          <div className="border-t border-[var(--color-gray-light)] pt-6">
            <h3 className="text-[16px] desktop:text-[18px] font-medium mb-4">
              С этим товаром покупают
            </h3>
            <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {recommendations.slice(0, 4).map((product) => (
                <div key={product.id} className="w-[160px] md:w-[200px] shrink-0">
                  <ProductCard
                    product={product}
                    variant="compact"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
