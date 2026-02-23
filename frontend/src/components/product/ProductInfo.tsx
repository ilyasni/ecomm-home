"use client";

import { useState } from "react";
import { Icon } from "@/design-system/icons";
import { Button, Select, Quantity } from "@/design-system/components";
import { SizeChartModal } from "@/components/product/SizeChartModal";
import { OrderFormPanel } from "@/components/product/OrderFormPanel";
import type { Product } from "@/components/catalog/ProductCard";

type ProductInfoProps = {
  product: Product;
  onAddToCart?: (id: string) => void;
  className?: string;
};

const sizeOptions = [
  { value: "1.5", label: "1,5 сп" },
  { value: "2", label: "2 сп" },
  { value: "euro", label: "Евро" },
  { value: "family", label: "Семейный" },
];

type AccordionItem = {
  id: string;
  title: string;
  content: string;
};

const descriptions: AccordionItem[] = [
  {
    id: "description",
    title: "Описание",
    content:
      "Однотонный комплект постельного белья «Ария» из премиального сатина в оттенке Экрю выглядит уютным и изысканным, создает расслабляющую, комфортную атмосферу в спальне. Подходит для интерьеров в классическом, английском, скандинавском, современном и других стилях.",
  },
  {
    id: "kit",
    title: "Комплектация",
    content: "Простыня на резинке, две наволочки 70×70 см, пододеяльник.",
  },
  {
    id: "color",
    title: "Цвет",
    content: "Экрю",
  },
  {
    id: "fabric",
    title: "Ткань",
    content: "100% хлопок сатин",
  },
  {
    id: "density",
    title: "Плотность ткани",
    content: "300 TC",
  },
  {
    id: "care",
    title: "Рекомендации по уходу",
    content: "Деликатная стирка при 30 градусах",
  },
  {
    id: "size",
    title: "Размер",
    content: "Таблица размеров",
  },
  {
    id: "delivery",
    title: "Доставка и оплата",
    content:
      "Доставка по Москве — 1–2 дня. По России — 3–7 дней. Бесплатно при заказе от 10 000 ₽. Оплата картой или наличными при получении.",
  },
];

export function ProductInfo({
  product,
  onAddToCart,
  className,
}: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [orderPanelOpen, setOrderPanelOpen] = useState(false);
  const [consultationPanelOpen, setConsultationPanelOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["description"])
  );
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const inStock = product.inStock !== false;

  const toggleAccordion = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={`${className || ""}`}>
      {/* Заголовок */}
      <h1 className="text-2xl font-medium leading-[1.1] md:text-[32px] desktop:text-[40px]">
        {product.title}
      </h1>

      {/* Цена */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-xl font-medium leading-[1.1] desktop:text-[24px]">
          {product.price}
        </span>
        {product.oldPrice && (
          <span className="text-base font-medium leading-normal text-[var(--color-brown)] line-through desktop:text-[20px]">
            {product.oldPrice}
          </span>
        )}
      </div>

      {/* Артикул */}
      {product.sku && (
        <p className="mt-6 text-[14px] leading-[1.3] text-[var(--color-black)]">
          <span className="font-medium">Артикул:</span>{" "}
          <span className="font-normal">{product.sku}</span>
        </p>
      )}

      {/* Цвет */}
      {product.colors && product.colors.length > 0 && (
        <div className="mt-6">
          <p className="text-[16px] leading-[1.3]">
            <span className="font-medium">Цвет: </span>
            <span className="font-normal">{product.colors[0].name}</span>
          </p>
          <div className="mt-3 flex gap-2">
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
          <p className="mt-2 text-[12px] leading-[1.1] text-[var(--color-gray)]">
            Оттенок на сайте может отличаться
          </p>
        </div>
      )}

      {/* Статус наличия + Таблица размеров */}
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {inStock ? (
              <>
                <Icon name="checkCircle" size={24} />
                <span className="text-[14px] leading-[1.3] text-[var(--color-dark)]">
                  В наличии
                </span>
              </>
            ) : (
              <>
                <Icon name="clock" size={20} />
                <span className="text-[14px] leading-[1.3] text-[var(--color-dark)]">
                  Под заказ
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSizeChartOpen(true)}
            className="text-[14px] leading-[1.3] text-[var(--color-gray)] underline"
          >
            Таблица размеров
          </button>
        </div>

        {inStock && (
          <div className="flex items-center gap-1">
            <Icon name="location" size={24} />
            <button
              type="button"
              className="text-[14px] leading-[1.3] text-[var(--color-brand)] underline"
            >
              Наличие в бутиках
            </button>
          </div>
        )}
      </div>

      {/* Dropdown размера */}
      <div className="mt-5">
        <Select
          options={sizeOptions}
          placeholder="Размер"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          fullWidth
        />
      </div>

      {/* Кнопки */}
      {inStock ? (
        <div className="mt-6 flex flex-col gap-2">
          {addedToCart ? (
            <div className="flex gap-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  /* Навигация в корзину */
                }}
              >
                Перейти в корзину
              </Button>
              <Quantity
                value={quantity}
                onChange={setQuantity}
                min={1}
                size="medium"
              />
            </div>
          ) : (
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setAddedToCart(true);
                onAddToCart?.(product.id);
              }}
            >
              В корзину
            </Button>
          )}
          <Button variant="secondary" fullWidth>
            Быстрый заказ
          </Button>
        </div>
      ) : (
        <div className="mt-6">
          <Button
            variant="primary"
            fullWidth
            onClick={() => setOrderPanelOpen(true)}
          >
            Сделать заказ
          </Button>
        </div>
      )}

      {/* Гарантия */}
      <p className="mt-3 text-center text-[12px] leading-[1.1] text-[var(--color-gray)]">
        Мы гарантируем качество – при обнаружении брака{" "}
        <span className="font-semibold">возврат или обмен</span> возможен
      </p>

      {/* Консультация */}
      <button
        type="button"
        onClick={() => setConsultationPanelOpen(true)}
        className="mt-6 flex items-start gap-1 text-left"
      >
        <Icon name="chatBubbles" size={28} className="shrink-0" />
        <p className="text-[14px] leading-[1.3] text-[var(--color-dark)]">
          <span className="font-semibold underline">
            Консультация эксперта.
          </span>{" "}
          Остались вопросы? Воспользуйтесь нашим бесплатным сервисом
        </p>
      </button>

      {/* Accordion */}
      <div className="mt-8">
        {descriptions.map((item) => (
          <div
            key={item.id}
            className="border-b border-[var(--color-gray-light)]"
          >
            <button
              type="button"
              onClick={() => toggleAccordion(item.id)}
              className="flex w-full items-center justify-between py-4"
            >
              <span className="text-[16px] font-medium leading-[1.3]">
                {item.title}
              </span>
              <Icon
                name="chevronDown"
                size={20}
                className={`transition-transform ${
                  expandedItems.has(item.id) ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedItems.has(item.id) && (
              <p className="pb-4 text-[16px] font-normal leading-[1.3] text-[var(--color-dark)]">
                {item.content}
              </p>
            )}
          </div>
        ))}
      </div>

      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
      />

      <OrderFormPanel
        isOpen={orderPanelOpen}
        onClose={() => setOrderPanelOpen(false)}
        variant="order"
      />

      <OrderFormPanel
        isOpen={consultationPanelOpen}
        onClose={() => setConsultationPanelOpen(false)}
        variant="consultation"
      />
    </div>
  );
}
