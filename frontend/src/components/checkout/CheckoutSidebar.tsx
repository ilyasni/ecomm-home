"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/design-system/components";
import type { CartItem } from "@/data/account";

interface CheckoutSidebarProps {
  items: CartItem[];
  subtotal: string;
  discount: string;
  promoDiscount?: string;
  bonusDiscount?: string;
  deliveryPrice: string;
  total: string;
  bonusEarned: number;
  isSubmitting: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}

export function CheckoutSidebar({
  items,
  subtotal,
  discount,
  promoDiscount,
  bonusDiscount,
  deliveryPrice,
  total,
  bonusEarned,
  isSubmitting,
  canSubmit,
  onSubmit,
}: CheckoutSidebarProps) {
  return (
    <aside className="w-full md:w-[447px] shrink-0">
      <div className="border border-[var(--color-gray-light)] rounded-[5px] p-4 md:p-6 md:sticky md:top-[160px]">
        <h2 className="text-[20px] md:text-[22px] font-medium mb-4">Ваш заказ</h2>

        {/* Товары */}
        <div className="space-y-3 mb-4 pb-4 border-b border-[var(--color-gray-light)]">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-[60px] h-[60px] relative shrink-0 rounded overflow-hidden bg-[var(--color-beige)]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] leading-[1.3] line-clamp-2">{item.title}</p>
                <p className="text-[13px] text-[var(--color-dark)] mt-0.5">
                  {item.quantity} шт. &middot; {item.price}
                </p>
              </div>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-[13px] text-[var(--color-dark)]">
              и ещё {items.length - 3} товар(ов)
            </p>
          )}
        </div>

        {/* Расчёт */}
        <div className="space-y-2 text-[14px] mb-4 pb-4 border-b border-[var(--color-gray-light)]">
          <div className="flex justify-between">
            <span>{items.length} товар(ов)</span>
            <span>{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Скидка</span>
            <span className="text-[var(--color-gold)]">- {discount}</span>
          </div>
          {promoDiscount && (
            <div className="flex justify-between">
              <span>Промокод</span>
              <span className="text-[var(--color-gold)]">- {promoDiscount}</span>
            </div>
          )}
          {bonusDiscount && (
            <div className="flex justify-between">
              <span>Бонусы</span>
              <span className="text-[var(--color-gold)]">- {bonusDiscount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Доставка</span>
            <span>{deliveryPrice}</span>
          </div>
        </div>

        {/* Итого */}
        <div className="mb-4">
          <div className="flex justify-between items-baseline">
            <span className="text-[18px] font-medium">Итого</span>
            <span className="text-[22px] font-medium">{total}</span>
          </div>
          {bonusEarned > 0 && (
            <div className="flex justify-between text-[12px] text-[var(--color-dark)] mt-1">
              <span>Будет начислено бонусов</span>
              <span className="text-[var(--color-gold)] font-medium">+ {bonusEarned}</span>
            </div>
          )}
          <Link
            href="/account/loyalty"
            className="text-[12px] text-[var(--color-dark)] underline mt-1 inline-block"
          >
            Правила программы лояльности
          </Link>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={onSubmit}
          isLoading={isSubmitting}
          disabled={!canSubmit || isSubmitting}
        >
          Оформить заказ
        </Button>

        <p className="text-[11px] text-[var(--color-dark)] text-center leading-[1.4] mt-3">
          Нажимая на кнопку, вы соглашаетесь с{" "}
          <Link href="#" className="underline">условиями оферты</Link>
          {" "}и{" "}
          <Link href="#" className="underline">политикой конфиденциальности</Link>
        </p>
      </div>

      {/* Мобильная фиксированная кнопка */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--background)] border-t border-[var(--color-gray-light)] p-4 md:hidden z-40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[16px] font-medium">Итого</span>
          <span className="text-[18px] font-medium">{total}</span>
        </div>
        <Button
          variant="primary"
          fullWidth
          onClick={onSubmit}
          isLoading={isSubmitting}
          disabled={!canSubmit || isSubmitting}
        >
          Оформить заказ
        </Button>
      </div>
    </aside>
  );
}
