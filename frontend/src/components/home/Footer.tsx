"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/design-system/icons";
import { Input, Button } from "@/design-system/components";
import type { FooterData } from "@/lib/queries/navigation";

const defaultCatalogLinks = [
  { label: "Постельное белье", href: "/catalog" },
  { label: "Домашний текстиль", href: "/catalog" },
  { label: "Одеяла", href: "/catalog" },
  { label: "Подушки", href: "/catalog" },
  { label: "Пледы", href: "/catalog" },
  { label: "Полотенца", href: "/catalog" },
  { label: "Будуарные наряды", href: "/catalog" },
  { label: "Подарочные сертификаты", href: "/catalog" },
];

const defaultBuyersLinks = [
  { label: "О компании", href: "/about" },
  { label: "Контакты", href: "/contacts" },
  { label: "Помощь", href: "/customer-info" },
  { label: "Доставка, оплата и возврат", href: "/customer-info" },
  { label: "Бутики", href: "/contacts" },
  { label: "Блог/Новости", href: "/news" },
];

const defaultSocials = [
  { label: "vahome@mail.ru", href: "mailto:vahome@mail.ru", icon: "email" },
  { label: "+7 926 000 35 92", href: "tel:+79260003592", icon: "phone" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "ВКонтакте", href: "#", icon: "vk" },
  { label: "Telegram", href: "#", icon: "telegram" },
];

type FooterProps = {
  footer?: FooterData | null;
};

export function Footer({ footer }: FooterProps) {
  const [email, setEmail] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    col0: true,
    col1: false,
    col2: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const columns = footer?.columns ?? [
    { title: "Каталог", links: defaultCatalogLinks },
    { title: "Покупателям", links: defaultBuyersLinks },
  ];
  const socials = footer?.socials ?? defaultSocials;
  const bottomText = footer?.bottomText ?? "© 2025 Vita Brava Home";

  return (
    <footer className="bg-[var(--color-black)] text-[var(--color-gray-light)]">
      <div className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
        {/* Desktop: Main content */}
        <div className="desktop:grid desktop:grid-cols-[minmax(0,500px)_1fr] mb-10 hidden gap-10">
          {/* Newsletter */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex transition-opacity hover:opacity-80">
              <Image
                src="/assets/figma/footer/logo.svg"
                alt="Vita Brava Home"
                width={315}
                height={58}
                unoptimized
              />
            </Link>
            <div className="space-y-6">
              <p className="text-lg leading-[1.1] font-medium">
                Подпишитесь на наши новости и акции
              </p>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    className="border-[var(--color-gray-light)] bg-transparent text-[var(--color-gray-light)] placeholder:text-[var(--color-gray)]"
                  />
                  <Button variant="primary" className="px-6 whitespace-nowrap">
                    Подписаться
                  </Button>
                </div>
                <label className="flex items-center gap-2 text-sm text-[var(--color-gray-light)]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[var(--color-brand)]"
                    checked={privacyChecked}
                    onChange={(e) => setPrivacyChecked(e.target.checked)}
                  />
                  <span>Я ознакомлен с политикой конфиденциальности</span>
                </label>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.title} className="space-y-4">
                <p className="text-base leading-[1.3] font-medium">{col.title}</p>
                <ul className="space-y-3 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="transition-opacity hover:opacity-80">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact */}
            <div className="space-y-4">
              <p className="text-base leading-[1.3] font-medium">Связаться с нами</p>
              <ul className="space-y-2 text-sm">
                {socials.map((s) => (
                  <li key={s.label} className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                      <Icon name={(s.icon ?? "link") as never} size={20} />
                    </div>
                    <a href={s.href} className="transition-opacity hover:opacity-80">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile: Main content */}
        <div className="desktop:hidden mb-8 space-y-8">
          {/* Newsletter */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <Link href="/" className="inline-flex transition-opacity hover:opacity-80">
                <Icon name="logo" variant="default" size={301} height={56} alt="Vita Brava Home" />
              </Link>
            </div>
            <div className="space-y-4">
              <p className="text-center text-base leading-[1.1] font-medium">
                Подпишитесь на наши новости и акции
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  className="border-[var(--color-gray-light)] bg-transparent text-[var(--color-gray-light)] placeholder:text-[var(--color-gray)]"
                />
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm text-[var(--color-gray-light)]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[var(--color-brand)]"
                      checked={privacyChecked}
                      onChange={(e) => setPrivacyChecked(e.target.checked)}
                    />
                    <span>Я ознакомлен с политикой конфиденциальности</span>
                  </label>
                  <Button variant="primary" fullWidth>
                    Подписаться
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible sections */}
          <div className="space-y-4">
            {columns.map((col, idx) => (
              <div key={col.title}>
                <button
                  onClick={() => toggleSection(`col${idx}`)}
                  className="flex w-full items-center justify-between text-base leading-[1.3] font-medium"
                >
                  <span>{col.title}</span>
                  <Icon
                    name="chevronDown"
                    size={20}
                    className={`transition-transform ${expandedSections[`col${idx}`] ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedSections[`col${idx}`] && (
                  <ul className="mt-4 space-y-3 border-b border-[var(--color-dark-gray)] pb-3 text-sm">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href} className="transition-opacity hover:opacity-80">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Contact */}
            <div>
              <button
                onClick={() => toggleSection("contact")}
                className="flex w-full items-center justify-between text-base leading-[1.3] font-medium"
              >
                <span>Связаться с нами</span>
                <Icon
                  name="chevronDown"
                  size={20}
                  className={`transition-transform ${expandedSections.contact ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.contact && (
                <ul className="mt-4 space-y-3 text-sm">
                  {socials.map((s) => (
                    <li key={s.label} className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                        <Icon name={(s.icon ?? "link") as never} size={16} />
                      </div>
                      <a href={s.href} className="transition-opacity hover:opacity-80">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mb-8 flex flex-wrap items-center gap-6 text-base text-[var(--color-gray)]">
          <span className="opacity-70">Оплата на сайте</span>
          <div className="flex gap-3">
            <div className="flex h-[45px] w-[55px] items-center justify-center rounded-[5px] border border-[#e9eeff]">
              <span className="text-xs">VISA</span>
            </div>
            <div className="flex h-[45px] w-[55px] items-center justify-center rounded-[5px] border border-[#e9eeff]">
              <span className="text-xs">MC</span>
            </div>
            <div className="flex h-[45px] w-[55px] items-center justify-center rounded-[5px] border border-[#e9eeff]">
              <span className="text-xs">MIR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="desktop:px-0 border-t border-[var(--color-black)] px-4 py-6 md:px-[39px]">
        <div className="desktop:flex-row desktop:items-center desktop:justify-between mx-auto flex max-w-[1400px] flex-col gap-4 text-sm text-[var(--color-gray)]">
          <span>{bottomText}</span>
          <div className="flex flex-wrap gap-6">
            <Link href="/info/privacy" className="transition-opacity hover:opacity-80">
              Политика конфиденциальности
            </Link>
            <Link href="/info/consent" className="transition-opacity hover:opacity-80">
              Согласие на обработку персональных данных
            </Link>
            <Link href="/info/terms" className="transition-opacity hover:opacity-80">
              Условия продажи
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
