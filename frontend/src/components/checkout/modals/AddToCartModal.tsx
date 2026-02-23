"use client";

import Image from "next/image";
import Link from "next/link";
import { Modal, Button } from "@/design-system/components";
import { ProductCard } from "@/components/catalog/ProductCard";
import { recommendedProducts, type CartItem } from "@/data/account";

interface AddToCartModalProps {
  open: boolean;
  onClose: () => void;
  addedItems: CartItem[];
  totalItems: number;
  totalPrice: string;
}

export function AddToCartModal({
  open,
  onClose,
  addedItems,
  totalItems,
  totalPrice,
}: AddToCartModalProps) {
  return (
    <Modal open={open} onClose={onClose} variant="right">
      <div className="p-4 md:p-6 max-h-[100vh] overflow-y-auto">
        <h2 className="text-[18px] md:text-[22px] font-medium mb-4">
          Товар добавлен в корзину
        </h2>

        {/* Добавленные товары */}
        <div className="space-y-3 mb-4 pb-4 border-b border-[var(--color-gray-light)]">
          {addedItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] relative shrink-0 rounded overflow-hidden bg-[var(--color-beige)]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium leading-[1.3] line-clamp-2">{item.title}</p>
                <p className="text-[13px] text-[var(--color-dark)] mt-1">{item.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[14px] font-medium">{item.price}</span>
                  {item.oldPrice && (
                    <span className="text-[12px] text-[var(--color-brown)] line-through">
                      {item.oldPrice}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[var(--color-dark)] mt-0.5">
                  Кол-во: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Итого */}
        <p className="text-[14px] text-[var(--color-dark)] mb-4">
          В корзине {totalItems} товар(а) на сумму {totalPrice}
        </p>

        {/* Кнопки */}
        <div className="flex flex-col md:flex-row gap-2 mb-6">
          <Link href="/cart" className="flex-1">
            <Button variant="primary" fullWidth>
              Перейти в корзину
            </Button>
          </Link>
          <Link href="/checkout" className="flex-1">
            <Button variant="secondary" fullWidth>
              Быстрый заказ
            </Button>
          </Link>
        </div>

        {/* Рекомендации */}
        {recommendedProducts.length > 0 && (
          <div className="border-t border-[var(--color-gray-light)] pt-4">
            <h3 className="text-[16px] font-medium mb-3">Рекомендуем</h3>
            <div className="grid grid-cols-2 gap-3">
              {recommendedProducts.slice(0, 2).map((product) => (
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
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
