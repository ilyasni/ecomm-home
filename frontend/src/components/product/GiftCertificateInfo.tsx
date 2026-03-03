"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/design-system/icons";
import { Button, Input, Checkbox } from "@/design-system/components";
import { Textarea } from "@/design-system/components/Textarea";
import { PhoneInput } from "@/design-system/components/PhoneInput";
import type { Product } from "@/components/catalog/ProductCard";

type GiftCertificateInfoProps = {
  product: Product;
  onAddToCart?: (id: string) => void;
  className?: string;
};

type CertificateVariant = "electronic" | "physical";

const PRICE_MIN = 5000;
const PRICE_MAX = 100000;

function formatPrice(value: number): string {
  return value.toLocaleString("ru-RU") + " ₽";
}

type AccordionItem = {
  id: string;
  title: string;
  content: string;
};

export function GiftCertificateInfo({ product, onAddToCart, className }: GiftCertificateInfoProps) {
  const [variant, setVariant] = useState<CertificateVariant>("electronic");
  const [price, setPrice] = useState(PRICE_MIN);

  // Electronic variant state
  const [greeting, setGreeting] = useState("");
  const [notifyUsage, setNotifyUsage] = useState(false);
  const [sendToSelf, setSendToSelf] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [sendImmediately, setSendImmediately] = useState(true);
  const [sendDate, setSendDate] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Accordion state
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["description"]));

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

  const descriptions: AccordionItem[] = [
    {
      id: "description",
      title: "Описание",
      content:
        product.giftCertDescription ||
        "Когда хочется порадовать близких, но не уверены в размере, цвете или предпочтениях — подарочный сертификат станет идеальным решением.",
    },
    {
      id: "delivery",
      title: "Доставка и оплата",
      content:
        "Доставка по Москве — 1–2 дня. По России — 3–7 дней. Бесплатно при заказе от 10 000 ₽.",
    },
  ];

  const sliderPercent = ((price - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className={`${className || ""}`}>
      {/* Заголовок */}
      <h1 className="desktop:text-[40px] text-2xl leading-[1.1] font-medium md:text-[32px]">
        {product.title}
      </h1>

      {/* Подзаголовок */}
      {product.subtitle && (
        <p className="desktop:text-[16px] mt-6 text-[14px] leading-[1.3] text-[var(--color-dark)]">
          {product.subtitle}
        </p>
      )}

      {/* Переключатель варианта */}
      <div className="desktop:gap-[80px] mt-6 flex items-center gap-6">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="certVariant"
            value="electronic"
            checked={variant === "electronic"}
            onChange={() => setVariant("electronic")}
            className="h-[18px] w-[18px] accent-[var(--color-brand)]"
          />
          <span className="text-[16px] leading-[1.3] text-[var(--color-black)]">электронный</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="certVariant"
            value="physical"
            checked={variant === "physical"}
            onChange={() => setVariant("physical")}
            className="h-[18px] w-[18px] accent-[var(--color-brand)]"
          />
          <span className="text-[16px] leading-[1.3] text-[var(--color-black)]">
            на физическом носителе
          </span>
        </label>
      </div>

      {/* Цена */}
      <div className="mt-8">
        <span className="desktop:text-[24px] text-xl leading-[1.1] font-medium">
          {formatPrice(price)}
        </span>
      </div>

      {/* Слайдер цены */}
      <div className="mt-6">
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={1000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="price-slider w-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-brown) 0%, var(--color-brown) ${sliderPercent}%, var(--color-gray-light) ${sliderPercent}%, var(--color-gray-light) 100%)`,
          }}
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[14px] leading-[1.2] text-[var(--color-gray)]">
            {formatPrice(PRICE_MIN)}
          </span>
          <span className="text-[14px] leading-[1.2] text-[var(--color-gray)]">
            {formatPrice(PRICE_MAX)}
          </span>
        </div>
      </div>

      {/* Уведомление о VIA (для электронного) */}
      {variant === "electronic" && (
        <div className="mt-4">
          <Checkbox
            checked={notifyUsage}
            onChange={setNotifyUsage}
            label="Оповещение о использовании подарочного сертификата VIA"
          />
        </div>
      )}

      {/* Статус наличия */}
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Icon name="checkCircle" size={24} />
            <span className="text-[14px] leading-[1.3] text-[var(--color-dark)]">В наличии</span>
          </div>
          <span className="text-right text-[12px] leading-[1.1] text-[var(--color-gray)] underline">
            Правила использования
            <br />
            подарочных сертификатов VA
          </span>
        </div>

        {variant === "physical" && (
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

      {/* Электронный вариант: Поздравление + формы */}
      {variant === "electronic" && (
        <>
          {/* Текст поздравления */}
          <div className="desktop:p-6 mt-6 rounded-none bg-[#f4f3ef] p-4">
            <p className="text-[16px] leading-[1.1] font-medium text-[var(--color-black)]">
              Текст для вашего поздравления
            </p>
            <div className="mt-4">
              <Textarea
                placeholder="С Днём рождения!"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                maxLength={160}
                showCharCount
                fullWidth
                rows={5}
              />
            </div>
          </div>

          {/* Куда отправить? */}
          <div className="mt-6">
            <p className="text-[16px] leading-[1.3] font-medium text-[var(--color-black)]">
              Куда отправить?
            </p>

            <div className="mt-4">
              <Checkbox checked={sendToSelf} onChange={setSendToSelf} label="Отправить себе" />
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div className="desktop:grid-cols-2 grid grid-cols-1 gap-3">
                <Input
                  placeholder="Имя отправителя*"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  fullWidth
                />
                <Input
                  placeholder="Имя получателя*"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  fullWidth
                />
              </div>
              <div className="desktop:grid-cols-2 grid grid-cols-1 gap-3">
                <Input
                  placeholder="E-mail отправителя*"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  fullWidth
                />
                <Input
                  placeholder="E-mail получателя*"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  fullWidth
                />
              </div>
              <PhoneInput
                placeholder="999 999 99 99"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                fullWidth
              />
            </div>
          </div>

          {/* Когда отправить? */}
          <div className="mt-6">
            <p className="text-[16px] leading-[1.3] font-medium text-[var(--color-black)]">
              Когда отправить?
            </p>

            <div className="mt-4">
              <Checkbox
                checked={sendImmediately}
                onChange={setSendImmediately}
                label="Отправить сразу"
              />
            </div>

            {!sendImmediately && (
              <div className="mt-4 flex flex-col gap-2">
                <Input
                  type="date"
                  placeholder="Начальная дата"
                  value={sendDate}
                  onChange={(e) => setSendDate(e.target.value)}
                  fullWidth
                />
              </div>
            )}

            <p className="mt-3 text-[12px] leading-[1.1] text-[var(--color-gray)]">
              Мы отправим электронное письмо в 10:00 по московскому времени
            </p>
          </div>

          {/* Согласие + Кнопка */}
          <div className="mt-6">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 h-[18px] w-[18px] shrink-0 appearance-none rounded-[2px] border border-[var(--color-gray)] checked:border-[var(--color-brand)] checked:bg-[var(--color-brand)]"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
              />
              <span className="text-[14px] leading-[1.3] text-[var(--color-black)]">
                Я ознакомлен с{" "}
                <Link href="/info/terms" className="underline">
                  Правилами использования
                </Link>{" "}
                и согласен с{" "}
                <Link href="/info/terms" className="underline">
                  условиями предоставления подарочных сертификатов
                </Link>
              </span>
            </label>

            <div className="mt-4">
              <Button variant="primary" fullWidth onClick={() => onAddToCart?.(product.id)}>
                В корзину
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Физический вариант: кнопка */}
      {variant === "physical" && (
        <div className="mt-6">
          <Button variant="primary" fullWidth onClick={() => onAddToCart?.(product.id)}>
            В корзину
          </Button>
        </div>
      )}

      {/* Аккордеон описания */}
      <div className="mt-6">
        {descriptions.map((item) => (
          <div key={item.id} className="border-b border-[var(--color-gray-light)]">
            <button
              type="button"
              onClick={() => toggleAccordion(item.id)}
              className="flex w-full items-center justify-between py-4"
            >
              <span className="text-[16px] leading-[1.3] font-medium">{item.title}</span>
              <Icon
                name="chevronDown"
                size={20}
                className={`transition-transform ${expandedItems.has(item.id) ? "rotate-180" : ""}`}
              />
            </button>
            {expandedItems.has(item.id) && (
              <div className="pb-4 text-[16px] leading-[1.3] font-normal whitespace-pre-line text-[var(--color-dark)]">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
