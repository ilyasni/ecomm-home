"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/design-system/components";
import type { CartItem } from "@/data/account";

interface CheckoutSidebarProps {
  items: CartItem[];
  subtotal: string;
  discount?: string;
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
  discount = undefined,
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
    <aside className="w-full shrink-0 md:w-[447px]">
      <div className="desktop:top-[160px] rounded-[5px] border border-[var(--color-gray-light)] p-4 md:sticky md:top-[180px] md:p-6">
        <h2 className="mb-4 text-[20px] font-medium md:text-[22px]">Ваш заказ</h2>

        {/* Товары */}
        <div className="mb-4 space-y-3 border-b border-[var(--color-gray-light)] pb-4">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded bg-[var(--color-beige)]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[13px] leading-[1.3]">{item.title}</p>
                <p className="mt-0.5 text-[13px] text-[var(--color-dark)]">
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
        <div className="mb-4 space-y-2 border-b border-[var(--color-gray-light)] pb-4 text-[14px]">
          <div className="flex justify-between">
            <span>{items.length} товар(ов)</span>
            <span>{subtotal}</span>
          </div>
          {discount && (
            <div className="flex justify-between">
              <span>Скидка</span>
              <span className="text-[var(--color-gold)]">- {discount}</span>
            </div>
          )}
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
          <div className="flex items-baseline justify-between">
            <span className="text-[18px] font-medium">Итого</span>
            <span className="text-[22px] font-medium">{total}</span>
          </div>
          {bonusEarned > 0 && (
            <div className="mt-1 flex justify-between text-[12px] text-[var(--color-dark)]">
              <span>Будет начислено бонусов</span>
              <span className="font-medium text-[var(--color-gold)]">+ {bonusEarned}</span>
            </div>
          )}
          <Link
            href="/account/loyalty"
            className="mt-1 inline-block text-[12px] text-[var(--color-dark)] underline"
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

        <p className="mt-3 text-center text-[11px] leading-[1.4] text-[var(--color-dark)]">
          Нажимая на кнопку, вы соглашаетесь с{" "}
          <Link href="/info/terms" className="underline">
            условиями оферты
          </Link>{" "}
          и{" "}
          <Link href="/info/privacy" className="underline">
            политикой конфиденциальности
          </Link>
        </p>
      </div>

      {/* Мобильная фиксированная кнопка */}
      <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-[var(--color-gray-light)] bg-[var(--background)] p-4 md:hidden">
        <div className="mb-2 flex items-center justify-between">
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
