"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/design-system/icons";
import { Input, Button } from "@/design-system/components";

export function Footer() {
  const [email, setEmail] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    catalog: true,
    buyers: false,
    contact: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const catalogLinks = [
    { label: "Постельное белье", href: "/catalog" },
    { label: "Домашний текстиль", href: "/catalog" },
    { label: "Одеяла", href: "/catalog" },
    { label: "Подушки", href: "/catalog" },
    { label: "Пледы", href: "/catalog" },
    { label: "Полотенца", href: "/catalog" },
    { label: "Будуарные наряды", href: "/catalog" },
    { label: "Подарочные сертификаты", href: "/catalog" },
  ];

  const buyersLinks = [
    { label: "О компании", href: "/about" },
    { label: "Контакты", href: "/contacts" },
    { label: "Помощь", href: "/customer-info" },
    { label: "Доставка, оплата и возврат", href: "/customer-info" },
    { label: "Бутики", href: "/contacts" },
    { label: "Блог/Новости", href: "/news" },
  ];

  return (
    <footer className="bg-[var(--color-black)] text-[var(--color-gray-light)]">
      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-[39px] desktop:px-0 desktop:py-[80px]">
        {/* Desktop: Main content */}
        <div className="hidden desktop:grid desktop:grid-cols-[minmax(0,500px)_1fr] gap-10 mb-10">
          {/* Newsletter */}
          <div className="space-y-6">
            <Image
              src="/assets/figma/footer/logo.svg"
              alt="Vita Brava Home"
              width={315}
              height={58}
              unoptimized
            />
            <div className="space-y-6">
              <p className="text-lg font-medium leading-[1.1]">
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
                    className="bg-transparent border-[var(--color-gray-light)] text-[var(--color-gray-light)] placeholder:text-[var(--color-gray)]"
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
            {/* Catalog */}
            <div className="space-y-4">
              <p className="text-base font-medium leading-[1.3]">Каталог</p>
              <ul className="space-y-3 text-sm">
                {catalogLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:opacity-80 transition-opacity">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Buyers */}
            <div className="space-y-4">
              <p className="text-base font-medium leading-[1.3]">Покупателям</p>
              <ul className="space-y-3 text-sm">
                {buyersLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:opacity-80 transition-opacity">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <p className="text-base font-medium leading-[1.3]">Связаться с нами</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                    <Icon name="email" size={20} />
                  </div>
                  <a href="mailto:vahome@mail.ru" className="hover:opacity-80 transition-opacity">
                    vahome@mail.ru
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                    <Icon name="phone" size={20} />
                  </div>
                  <a href="tel:+79260003592" className="hover:opacity-80 transition-opacity">
                    +7 926 000 35 92
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                    <Icon name="instagram" size={20} />
                  </div>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    Instagram
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                    <Icon name="vk" size={20} />
                  </div>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    ВКонтакте
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                    <Icon name="telegram" size={20} />
                  </div>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    Telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile: Main content */}
        <div className="desktop:hidden space-y-8 mb-8">
          {/* Newsletter */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <Icon name="logo" variant="default" size={301} height={56} alt="Vita Brava Home" />
            </div>
            <div className="space-y-4">
              <p className="text-base font-medium leading-[1.1] text-center">
                Подпишитесь на наши новости и акции
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  className="bg-transparent border-[var(--color-gray-light)] text-[var(--color-gray-light)] placeholder:text-[var(--color-gray)]"
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
            {/* Catalog */}
            <div>
              <button
                onClick={() => toggleSection("catalog")}
                className="flex w-full items-center justify-between text-base font-medium leading-[1.3]"
              >
                <span>Каталог</span>
                <Icon
                  name="chevronDown"
                  size={20}
                  className={`transition-transform ${expandedSections.catalog ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.catalog && (
                <ul className="mt-4 space-y-3 border-b border-[var(--color-dark-gray)] pb-3 text-sm">
                  {catalogLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="hover:opacity-80 transition-opacity">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Buyers */}
            <div>
              <button
                onClick={() => toggleSection("buyers")}
                className="flex w-full items-center justify-between text-base font-medium leading-[1.3]"
              >
                <span>Покупателям</span>
                <Icon
                  name="chevronDown"
                  size={20}
                  className={`transition-transform ${expandedSections.buyers ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.buyers && (
                <ul className="mt-4 space-y-3 border-b border-[var(--color-dark-gray)] pb-3 text-sm">
                  {buyersLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="hover:opacity-80 transition-opacity">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Contact */}
            <div>
              <button
                onClick={() => toggleSection("contact")}
                className="flex w-full items-center justify-between text-base font-medium leading-[1.3]"
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
                  <li className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                      <Icon name="email" size={16} />
                    </div>
                    <a href="mailto:vahome@mail.ru" className="hover:opacity-80 transition-opacity">
                      vahome@mail.ru
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                      <Icon name="phone" size={16} />
                    </div>
                    <a href="tel:+79260003592" className="hover:opacity-80 transition-opacity">
                      +7 926 000 35 92
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                      <Icon name="instagram" size={16} />
                    </div>
                    <a href="#" className="hover:opacity-80 transition-opacity">
                      Instagram
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                      <Icon name="vk" size={16} />
                    </div>
                    <a href="#" className="hover:opacity-80 transition-opacity">
                      VK
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)]">
                      <Icon name="telegram" size={16} />
                    </div>
                    <a href="#" className="hover:opacity-80 transition-opacity">
                      Telegram
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-base text-[var(--color-gray)]">
          <span className="opacity-70">Оплата на сайте</span>
          <div className="flex gap-3">
            <div className="border border-[#e9eeff] h-[45px] w-[55px] rounded-[5px] flex items-center justify-center">
              <span className="text-xs">VISA</span>
            </div>
            <div className="border border-[#e9eeff] h-[45px] w-[55px] rounded-[5px] flex items-center justify-center">
              <span className="text-xs">MC</span>
            </div>
            <div className="border border-[#e9eeff] h-[45px] w-[55px] rounded-[5px] flex items-center justify-center">
              <span className="text-xs">MIR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-black)] px-4 md:px-[39px] desktop:px-0 py-6">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 desktop:flex-row desktop:items-center desktop:justify-between text-sm text-[var(--color-gray)]">
          <span>© 2025 Vita Brava Home</span>
          <div className="flex flex-wrap gap-6">
            <a href="/info/privacy" className="hover:opacity-80 transition-opacity">
              Политика конфиденциальности
            </a>
            <a href="/info/consent" className="hover:opacity-80 transition-opacity">
              Согласие на обработку персональных данных
            </a>
            <a href="/info/terms" className="hover:opacity-80 transition-opacity">
              Условия продажи
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
