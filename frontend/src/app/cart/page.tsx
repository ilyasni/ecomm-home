"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Button, Quantity, Checkbox, Input } from "@/design-system/components";
import { Icon } from "@/design-system/icons";
import { ProductCard } from "@/components/catalog/ProductCard";
import { DeleteItemModal } from "@/components/checkout/modals/DeleteItemModal";
import { ClearCartModal } from "@/components/checkout/modals/ClearCartModal";
import {
  cartItems as initialCartItems,
  recentlyViewed,
  recommendedProducts,
  type CartItem,
} from "@/data/account";

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
    <div className="flex gap-3 md:gap-4 py-4 border-b border-[var(--color-gray-light)] relative">
      <div className="flex items-start pt-1 shrink-0">
        <Checkbox checked={selected} onChange={onSelect} />
      </div>

      <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] relative shrink-0 rounded overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] md:text-[16px] font-medium leading-[1.3] line-clamp-2">
            {item.title}
          </h3>
          <p className="text-[13px] text-[var(--color-dark)] mt-1">{item.description}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
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

        <div className="flex items-center gap-3 md:gap-6 flex-wrap">
          <div className="text-right shrink-0">
            <span className="text-[14px] md:text-[16px] font-medium">{item.price}</span>
            {item.oldPrice && (
              <span className="text-[12px] text-[var(--color-brown)] line-through ml-2">
                {item.oldPrice}
              </span>
            )}
          </div>

          <Quantity
            value={item.quantity}
            onChange={onQuantityChange}
            min={1}
            size="small"
          />

          <div className="text-right shrink-0">
            <span className="text-[14px] md:text-[16px] font-medium">{item.total}</span>
            {item.bonusReturn > 0 && (
              <p className="text-[12px] text-[var(--color-gold)]">
                Вернём {item.bonusReturn} ₽
              </p>
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

function OrderSidebar({ itemCount }: { itemCount: number }) {
  const [promoCode, setPromoCode] = useState("");
  const [bonuses, setBonuses] = useState("50");

  return (
    <aside className="w-full md:w-[340px] desktop:w-[447px] shrink-0 border border-[var(--color-gray-light)] rounded-[5px] h-fit md:sticky md:top-[160px]">
      <div className="p-5 md:p-6">
        <h2 className="text-[20px] md:text-[22px] font-medium mb-4">Ваш заказ</h2>

        <div className="flex justify-between text-[14px] mb-1">
          <span>{itemCount} товар(а) / 5 кг</span>
          <span className="font-medium">64 000 ₽</span>
        </div>
        <div className="flex justify-between text-[14px] mb-4">
          <span>Скидки по заказу</span>
          <span className="text-[var(--color-gold)]">- 4 000 ₽</span>
        </div>

        <div className="border-t border-[var(--color-gray-light)] pt-4 mb-4">
          <p className="text-[14px] font-medium mb-2">Промокод</p>
          <div className="relative">
            <Input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Введите промокод"
              className="w-full pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-dark)] hover:text-[var(--color-black)]"
              aria-label="Применить промокод"
            >
              <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>

        <div className="border-t border-[var(--color-gray-light)] pt-4 mb-4">
          <p className="text-[14px] font-medium mb-2">Бонусы по программе лояльности</p>
          <div className="relative">
            <Input
              value={bonuses}
              onChange={(e) => setBonuses(e.target.value)}
              className="w-full pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-dark)] hover:text-[var(--color-black)]"
              aria-label="Применить бонусы"
            >
              <Icon name="arrowRight" size={16} />
            </button>
          </div>
          <p className="text-[12px] text-[var(--color-dark)] mt-1">
            Можно списать <strong>100</strong> бонусов &nbsp; 1 бонус=1 ₽
          </p>
        </div>

        <div className="border-t border-[var(--color-gray-light)] pt-4 mb-4">
          <div className="flex justify-between items-baseline">
            <span className="text-[18px] font-medium">Сумма заказа</span>
            <span className="text-[22px] font-medium">60 000 ₽</span>
          </div>
          <div className="flex justify-between text-[12px] text-[var(--color-dark)] mt-1">
            <span>Будет начислено бонусов</span>
            <span className="text-[var(--color-gold)] font-medium">+ 3 000</span>
          </div>
          <Link
            href="/account/loyalty"
            className="text-[12px] text-[var(--color-dark)] underline mt-1 inline-block"
          >
            Правила программы лояльности
          </Link>
        </div>

        <Link href="/checkout">
          <Button variant="primary" fullWidth className="mb-3">
            Оформить заказ
          </Button>
        </Link>

        <p className="text-[11px] text-[var(--color-dark)] text-center leading-[1.4]">
          Доступные способы оплаты и время доставки можно выбрать
          в процессе оформления заказа
        </p>
      </div>
    </aside>
  );
}

function RecommendationsSlider({ title, products }: { title: string; products: typeof recommendedProducts }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-10 md:mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] md:text-[28px] font-medium">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-[var(--color-gray-light)] flex items-center justify-center hover:bg-[var(--color-beige)]"
            aria-label="Назад"
          >
            <Icon name="arrowRight" size={14} className="rotate-180" />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-[var(--color-gray-light)] flex items-center justify-center hover:bg-[var(--color-beige)]"
            aria-label="Вперёд"
          >
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      <div className="bg-[var(--color-beige)] rounded-[5px] py-6 px-4 text-center mb-6">
        <p className="text-[14px] md:text-[16px] leading-[1.5]">
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

      <div className="flex justify-center mb-10">
        <Link href="/catalog">
          <Button variant="primary">Перейти в каталог</Button>
        </Link>
      </div>

      <RecommendationsSlider title="Ранее вы смотрели" products={recentlyViewed.map(p => ({
        ...p,
        description: p.description,
      }))} />
    </>
  );
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const isEmpty = items.length === 0;

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
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveRequest = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (itemToDelete) {
      setItems((prev) => prev.filter((item) => item.id !== itemToDelete));
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
    setItems([]);
    setSelected(new Set());
    setSelectAll(false);
    setClearModalOpen(false);
  };

  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  return (
    <>
      <Header variant="solid" />

      <main className="pt-[111px] md:pt-[143px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 pb-12 md:pb-20">
          {/* Заголовок */}
          <h1 className="text-center text-[28px] md:text-[36px] font-medium leading-[1.2] mb-6 md:mb-8">
            Корзина{" "}
            <span className="text-[16px] md:text-[18px] font-normal text-[var(--color-dark)]">
              ({items.length}{" "}
              {items.length === 1
                ? "товар"
                : items.length < 5
                ? "товара"
                : "товаров"}
              )
            </span>
          </h1>

          {isEmpty ? (
            <EmptyCart />
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                <div className="flex-1 min-w-0">
                  {/* Ссылка "Продолжить покупки" */}
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 text-[14px] text-[var(--color-dark)] hover:text-[var(--color-black)] mb-4"
                  >
                    <Icon name="arrowRight" size={14} className="rotate-180" />
                    Продолжить покупки
                  </Link>

                  {/* Заголовок таблицы */}
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-[var(--color-gray-light)]">
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      label="Выбрать все"
                    />
                    <div className="flex items-center gap-4 text-[14px] text-[var(--color-dark)]">
                      <button type="button" className="flex items-center gap-1 hover:text-[var(--color-black)]">
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

                <OrderSidebar itemCount={items.length} />
              </div>

              {/* Рекомендации */}
              <RecommendationsSlider title="Рекомендуем" products={recommendedProducts} />

              {/* Ранее смотрели */}
              <RecommendationsSlider title="Ранее вы смотрели" products={recentlyViewed.map(p => ({
                ...p,
                description: p.description,
              }))} />
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
