"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Button, Quantity, Checkbox, Input } from "@/design-system/components";
import { Icon } from "@/design-system/icons";
import { ProductCard } from "@/components/catalog/ProductCard";
import { DeleteItemModal } from "@/components/checkout/modals/DeleteItemModal";
import { ClearCartModal } from "@/components/checkout/modals/ClearCartModal";
import { recentlyViewed, recommendedProducts, type CartItem } from "@/data/account";
import {
  clearCart,
  getCommerceSnapshot,
  removeCartItem,
  subscribeCommerce,
  toggleFavorite,
  updateCartQuantity,
} from "@/lib/commerce";

function CartItemRow({
  item,
  selected,
  onSelect,
  onQuantityChange,
  onRemove,
  onToggleFavorite,
}: {
  item: CartItem;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="relative flex gap-3 border-b border-[var(--color-gray-light)] py-4 md:gap-4">
      <div className="flex shrink-0 items-start pt-1">
        <Checkbox checked={selected} onChange={onSelect} />
      </div>

      <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded md:h-[140px] md:w-[140px]">
        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-start md:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[14px] leading-[1.3] font-medium md:text-[16px]">
            {item.title}
          </h3>
          <p className="mt-1 text-[13px] text-[var(--color-dark)]">{item.description}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  item.color === "Бежевый"
                    ? "#D4C5B0"
                    : item.color === "Белый"
                      ? "#F5F0EB"
                      : "#999",
              }}
            />
            <span className="text-[13px] text-[var(--color-dark)]">{item.color}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          <div className="shrink-0 text-right">
            <span className="text-[14px] font-medium md:text-[16px]">{item.price}</span>
            {item.oldPrice && (
              <span className="ml-2 text-[12px] text-[var(--color-brown)] line-through">
                {item.oldPrice}
              </span>
            )}
          </div>

          <Quantity value={item.quantity} onChange={onQuantityChange} min={1} size="small" />

          <div className="shrink-0 text-right">
            <span className="text-[14px] font-medium md:text-[16px]">{item.total}</span>
            {item.bonusReturn > 0 && (
              <p className="text-[12px] text-[var(--color-gold)]">Вернём {item.bonusReturn} ₽</p>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleFavorite}
            className="shrink-0"
            aria-label="В избранное"
          >
            <Icon
              name="favorite"
              size={20}
              className={item.isFavorite ? "text-[var(--color-gold)]" : ""}
            />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-4 right-0 text-[var(--color-dark)] hover:text-[var(--color-black)]"
        aria-label="Удалить"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

function formatRub(value: number): string {
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function OrderSidebar({ itemCount, subtotal }: { itemCount: number; subtotal: number }) {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    type: string;
    value: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const promoDiscount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? Math.round(subtotal * (appliedPromo.value / 100))
      : Math.min(appliedPromo.value, subtotal)
    : 0;
  const total = subtotal - promoDiscount;
  const bonusesAccrued = Math.round(total * 0.05);

  const handleApplyPromo = async () => {
    const code = promoCode.trim();
    if (!code) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const res = await fetch("/api/cart/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json()) as {
        valid: boolean;
        code?: string;
        discount?: { type: string; value: number };
        message?: string;
      };
      if (data.valid && data.discount) {
        setAppliedPromo({
          code: data.code ?? code,
          type: data.discount.type,
          value: data.discount.value,
        });
        setPromoError("");
      } else {
        setAppliedPromo(null);
        setPromoError(data.message ?? "Промокод не найден");
      }
    } catch {
      setPromoError("Не удалось проверить промокод");
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <aside className="desktop:w-[447px] h-fit w-full shrink-0 rounded-[5px] border border-[var(--color-gray-light)] md:sticky md:top-[160px] md:w-[340px]">
      <div className="p-5 md:p-6">
        <h2 className="mb-4 text-[20px] font-medium md:text-[22px]">Ваш заказ</h2>

        <div className="mb-1 flex justify-between text-[14px]">
          <span>
            {itemCount} {itemCount === 1 ? "товар" : itemCount < 5 ? "товара" : "товаров"}
          </span>
          <span className="font-medium">{formatRub(subtotal)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="mb-4 flex justify-between text-[14px]">
            <span>Промокод «{appliedPromo?.code}»</span>
            <span className="text-[var(--color-gold)]">- {formatRub(promoDiscount)}</span>
          </div>
        )}

        <div className="mb-4 border-t border-[var(--color-gray-light)] pt-4">
          <p className="mb-2 text-[14px] font-medium">Промокод</p>
          <div className="relative">
            <Input
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                setPromoError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
              placeholder="Введите промокод"
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={promoLoading}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-dark)] hover:text-[var(--color-black)] disabled:opacity-40"
              aria-label="Применить промокод"
            >
              <Icon name="arrowRight" size={16} />
            </button>
          </div>
          {appliedPromo && (
            <p className="mt-1 text-[12px] text-[var(--color-gold)]">
              Промокод применён: скидка{" "}
              {appliedPromo.type === "percentage"
                ? `${appliedPromo.value}%`
                : `${appliedPromo.value.toLocaleString("ru-RU")} ₽`}
            </p>
          )}
          {promoError && <p className="mt-1 text-[12px] text-red-500">{promoError}</p>}
        </div>

        <div className="mb-4 border-t border-[var(--color-gray-light)] pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[18px] font-medium">Сумма заказа</span>
            <span className="text-[22px] font-medium">{formatRub(total)}</span>
          </div>
          <div className="mt-1 flex justify-between text-[12px] text-[var(--color-dark)]">
            <span>Будет начислено бонусов</span>
            <span className="font-medium text-[var(--color-gold)]">
              + {bonusesAccrued.toLocaleString("ru-RU")}
            </span>
          </div>
          <Link
            href="/account/loyalty"
            className="mt-1 inline-block text-[12px] text-[var(--color-dark)] underline"
          >
            Правила программы лояльности
          </Link>
        </div>

        <Link href="/checkout">
          <Button variant="primary" fullWidth className="mb-3">
            Оформить заказ
          </Button>
        </Link>

        <p className="text-center text-[11px] leading-[1.4] text-[var(--color-dark)]">
          Доступные способы оплаты и время доставки можно выбрать в процессе оформления заказа
        </p>
      </div>
    </aside>
  );
}

function RecommendationsSlider({
  title,
  products,
}: {
  title: string;
  products: typeof recommendedProducts;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mt-10 md:mt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[22px] font-medium md:text-[28px]">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gray-light)] hover:bg-[var(--color-beige)]"
            aria-label="Назад"
          >
            <Icon name="arrowRight" size={14} className="rotate-180" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gray-light)] hover:bg-[var(--color-beige)]"
            aria-label="Вперёд"
          >
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((product) => (
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
            variant="medium"
          />
        ))}
      </div>
    </section>
  );
}

function EmptyCart() {
  return (
    <>
      <div className="mb-6 rounded-[5px] bg-[var(--color-beige)] px-4 py-6 text-center">
        <p className="text-[14px] leading-[1.5] md:text-[16px]">
          Ваша корзина пуста, но это легко исправить.
          <br />
          Посмотрите наши{" "}
          <Link href="/catalog" className="font-medium underline">
            новинки
          </Link>{" "}
          или воспользуйтесь{" "}
          <Link href="/catalog" className="font-medium underline">
            поиском
          </Link>
          .
        </p>
      </div>

      <div className="mb-10 flex justify-center">
        <Link href="/catalog">
          <Button variant="primary">Перейти в каталог</Button>
        </Link>
      </div>

      <RecommendationsSlider
        title="Ранее вы смотрели"
        products={recentlyViewed.map((p) => ({
          ...p,
          description: p.description,
        }))}
      />
    </>
  );
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const snapshot = getCommerceSnapshot();
      setItems(
        snapshot.cartItems.map((item) => {
          const priceNumber = Number(item.price.replace(/[^\d]/g, "")) || 0;
          return {
            id: item.id,
            title: item.title,
            description: item.description ?? "Товар",
            size: item.size,
            color: item.color ?? "Не указан",
            price: item.price,
            oldPrice: item.oldPrice,
            total: `${(priceNumber * item.quantity).toLocaleString("ru-RU")} ₽`,
            image: item.image,
            quantity: item.quantity,
            bonusReturn: Math.round(priceNumber * item.quantity * 0.03),
            isFavorite: Boolean(item.isFavorite),
          };
        })
      );
    };
    sync();
    return subscribeCommerce(sync);
  }, []);

  const isEmpty = items.length === 0;

  const subtotal = items.reduce((sum, item) => {
    const priceNumber = Number(item.price.replace(/[^\d]/g, "")) || 0;
    return sum + priceNumber * item.quantity;
  }, 0);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelected(new Set(items.map((item) => item.id)));
    } else {
      setSelected(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelected(next);
    setSelectAll(next.size === items.length);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    updateCartQuantity(id, quantity);
  };

  const handleRemoveRequest = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (itemToDelete) {
      removeCartItem(itemToDelete);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(itemToDelete);
        return next;
      });
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleClearConfirm = () => {
    clearCart();
    setSelected(new Set());
    setSelectAll(false);
    setClearModalOpen(false);
  };

  const handleToggleFavorite = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    toggleFavorite({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice,
    });
  };

  return (
    <>
      <Header variant="solid" />

      <main className="pt-[111px] md:pt-[143px]">
        <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 pb-12 md:px-[39px] md:pb-20">
          {/* Заголовок */}
          <h1 className="mb-6 text-center text-[28px] leading-[1.2] font-medium md:mb-8 md:text-[36px]">
            Корзина{" "}
            <span className="text-[16px] font-normal text-[var(--color-dark)] md:text-[18px]">
              ({items.length}{" "}
              {items.length === 1 ? "товар" : items.length < 5 ? "товара" : "товаров"})
            </span>
          </h1>

          {isEmpty ? (
            <EmptyCart />
          ) : (
            <>
              <div className="flex flex-col items-start gap-6 md:flex-row md:gap-8">
                <div className="min-w-0 flex-1">
                  {/* Ссылка "Продолжить покупки" */}
                  <Link
                    href="/catalog"
                    className="mb-4 inline-flex items-center gap-2 text-[14px] text-[var(--color-dark)] hover:text-[var(--color-black)]"
                  >
                    <Icon name="arrowRight" size={14} className="rotate-180" />
                    Продолжить покупки
                  </Link>

                  {/* Заголовок таблицы */}
                  <div className="mb-2 flex items-center justify-between border-b border-[var(--color-gray-light)] pb-2">
                    <Checkbox checked={selectAll} onChange={handleSelectAll} label="Выбрать все" />
                    <div className="flex items-center gap-4 text-[14px] text-[var(--color-dark)]">
                      <button
                        type="button"
                        className="flex items-center gap-1 hover:text-[var(--color-black)]"
                      >
                        <span>Поделиться</span>
                        <Icon name="arrowRight" size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setClearModalOpen(true)}
                        className="hover:text-[var(--color-black)]"
                        aria-label="Удалить все"
                      >
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Товары */}
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      selected={selected.has(item.id)}
                      onSelect={(checked) => handleSelectItem(item.id, checked)}
                      onQuantityChange={(q) => handleQuantityChange(item.id, q)}
                      onRemove={() => handleRemoveRequest(item.id)}
                      onToggleFavorite={() => handleToggleFavorite(item.id)}
                    />
                  ))}
                </div>

                <OrderSidebar itemCount={items.length} subtotal={subtotal} />
              </div>

              {/* Рекомендации */}
              <RecommendationsSlider title="Рекомендуем" products={recommendedProducts} />

              {/* Ранее смотрели */}
              <RecommendationsSlider
                title="Ранее вы смотрели"
                products={recentlyViewed.map((p) => ({
                  ...p,
                  description: p.description,
                }))}
              />
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Модальные окна */}
      <DeleteItemModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleRemoveConfirm}
      />

      <ClearCartModal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={handleClearConfirm}
      />
    </>
  );
}
