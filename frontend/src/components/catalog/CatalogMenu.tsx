"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/design-system/icons";
import type { IconName } from "@/design-system/icons/icon-map";
import {
  catalogCategories,
  catalogExtraLinks,
  catalogInfoLinks,
  type CatalogCategory,
} from "@/data/catalog-menu";

type CatalogMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CatalogMenu({ isOpen, onClose }: CatalogMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>(catalogCategories[0]?.id || "");
  const [mobileLevel, setMobileLevel] = useState<"main" | "category" | "filter">("main");
  const [mobileCategoryId, setMobileCategoryId] = useState<string>("");
  const [expandedFilter, setExpandedFilter] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeCat = catalogCategories.find((c) => c.id === activeCategory);
  const mobileCat = catalogCategories.find((c) => c.id === mobileCategoryId);

  const handleMobileCategoryClick = (catId: string) => {
    setMobileCategoryId(catId);
    setMobileLevel("category");
    setExpandedFilter("");
  };

  const handleMobileBack = () => {
    if (mobileLevel === "category") {
      setMobileLevel("main");
      setMobileCategoryId("");
    }
  };

  const toggleMobileFilter = (title: string) => {
    setExpandedFilter((prev) => (prev === title ? "" : title));
  };

  return (
    <>
      {/* ===== DESKTOP (≥1400px) ===== */}
      <div className="desktop:block fixed inset-0 top-[111px] z-40 hidden">
        <div className="absolute inset-0 bg-black/20" onClick={onClose} aria-hidden="true" />
        <div className="relative border-t border-[var(--color-gray-light)] bg-[var(--background)]">
          <div className="mx-auto flex max-w-[1400px] gap-12 px-2 py-8">
            {/* Левая колонка: категории */}
            <div className="flex w-[220px] shrink-0 flex-col gap-6">
              {catalogCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group flex items-center gap-2 text-left ${
                    activeCategory === cat.id
                      ? "text-[var(--color-brand)]"
                      : "text-[var(--color-black)]"
                  }`}
                >
                  <Icon name={cat.icon as IconName} size={24} className="shrink-0" />
                  <span className="flex-1 text-[16px] leading-[1.3] font-medium">{cat.label}</span>
                  <Icon name="chevronRight" size={20} className="shrink-0" />
                </button>
              ))}

              <div className="flex flex-col gap-4 border-t border-[var(--color-gray-light)] pt-4">
                {catalogExtraLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between text-[16px] leading-[1.3] font-medium text-[var(--color-black)] transition-colors hover:text-[var(--color-brand)]"
                  >
                    {link.label}
                    {link.hasSubmenu && <Icon name="chevronRight" size={20} />}
                  </a>
                ))}
              </div>
            </div>

            {/* Правая часть: фильтры и промо */}
            <div className="flex flex-1 gap-8">
              {activeCat && (
                <>
                  {/* Категории */}
                  {activeCat.subcategories && (
                    <div className="flex flex-col gap-3">
                      <h3 className="text-[14px] leading-[1.3] font-medium text-[var(--color-black)]">
                        Категории
                      </h3>
                      {activeCat.subcategories.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className="text-[14px] leading-[1.3] text-[var(--color-dark)] transition-colors hover:text-[var(--color-brand)]"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Фильтры */}
                  {activeCat.filters?.map((filter) => (
                    <div key={filter.title} className="flex flex-col gap-3">
                      <h3 className="text-[14px] leading-[1.3] font-medium text-[var(--color-black)]">
                        {filter.title}
                      </h3>
                      {filter.options.map((opt) => (
                        <a
                          key={opt.label + opt.href}
                          href={opt.href}
                          className="text-[14px] leading-[1.3] text-[var(--color-dark)] transition-colors hover:text-[var(--color-brand)]"
                        >
                          {opt.label}
                        </a>
                      ))}
                    </div>
                  ))}

                  {/* Промо изображения */}
                  <div className="ml-auto flex gap-4">
                    <a
                      href={activeCat.href}
                      className="group relative h-[160px] w-[200px] overflow-hidden rounded"
                    >
                      <Image
                        src="/assets/figma/placeholder.svg"
                        alt=""
                        fill
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 flex items-center gap-1 text-[12px] text-white">
                        смотреть коллекцию
                        <Icon name="arrowRight" size={16} />
                      </span>
                    </a>
                    <a
                      href={activeCat.href}
                      className="group relative h-[160px] w-[200px] overflow-hidden rounded"
                    >
                      <Image
                        src="/assets/figma/placeholder.svg"
                        alt=""
                        fill
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 flex items-center gap-1 text-[12px] text-white">
                        смотреть простыни
                        <Icon name="arrowRight" size={16} />
                      </span>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABLET (768px–1399px) ===== */}
      <div className="desktop:hidden fixed inset-0 top-[81px] z-40 hidden md:block">
        <div className="absolute inset-0 bg-black/20" onClick={onClose} aria-hidden="true" />
        <div className="relative max-h-[calc(100vh-81px)] overflow-y-auto border-t border-[var(--color-gray-light)] bg-[var(--background)]">
          <div className="flex gap-12 px-[39px] py-6">
            {/* Левая колонка: категории */}
            <div className="flex w-[220px] shrink-0 flex-col gap-5">
              {catalogCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 text-left ${
                    activeCategory === cat.id
                      ? "text-[var(--color-brand)]"
                      : "text-[var(--color-black)]"
                  }`}
                >
                  <Icon name={cat.icon as IconName} size={24} className="shrink-0" />
                  <span className="flex-1 text-[16px] leading-[1.3] font-medium">{cat.label}</span>
                  <Icon name="chevronRight" size={20} className="shrink-0" />
                </button>
              ))}

              <div className="flex flex-col gap-4 border-t border-[var(--color-gray-light)] pt-4">
                {catalogExtraLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between text-[16px] leading-[1.3] font-medium text-[var(--color-black)] transition-colors hover:text-[var(--color-brand)]"
                  >
                    {link.label}
                    {link.hasSubmenu && <Icon name="chevronRight" size={20} />}
                  </a>
                ))}
              </div>
            </div>

            {/* Правая часть: фильтры */}
            {activeCat && (
              <div className="flex flex-1 gap-8">
                {activeCat.subcategories && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[14px] leading-[1.3] font-medium text-[var(--color-black)]">
                      Категории
                    </h3>
                    {activeCat.subcategories.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        className="text-[14px] leading-[1.3] text-[var(--color-dark)] transition-colors hover:text-[var(--color-brand)]"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}

                {activeCat.filters?.map((filter) => (
                  <div key={filter.title} className="flex flex-col gap-3">
                    <h3 className="text-[14px] leading-[1.3] font-medium text-[var(--color-black)]">
                      {filter.title}
                    </h3>
                    {filter.options.map((opt) => (
                      <a
                        key={opt.label + opt.href}
                        href={opt.href}
                        className="text-[14px] leading-[1.3] text-[var(--color-dark)] transition-colors hover:text-[var(--color-brand)]"
                      >
                        {opt.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Нижний блок информационных ссылок */}
          <div className="mx-[39px] mb-6 flex flex-col gap-4 bg-[var(--color-gray-light)] p-[16px]">
            {catalogInfoLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center justify-between text-[16px] leading-[1.3] font-medium text-[var(--color-black)]"
              >
                {link.label}
                {link.hasSubmenu && <Icon name="chevronRight" size={20} />}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MOBILE (<768px) ===== */}
      <div className="fixed inset-0 z-40 bg-[var(--background)] md:hidden">
        {mobileLevel === "main" && <MobileMainLevel onCategoryClick={handleMobileCategoryClick} />}
        {mobileLevel === "category" && mobileCat && (
          <MobileCategoryLevel
            category={mobileCat}
            expandedFilter={expandedFilter}
            onToggleFilter={toggleMobileFilter}
            onBack={handleMobileBack}
          />
        )}
      </div>
    </>
  );
}

function MobileMainLevel({ onCategoryClick }: { onCategoryClick: (catId: string) => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header mobile: оставляем существующий хедер, этот блок не нужен */}

      {/* Войти / Бутики */}
      <div className="flex flex-col gap-4 bg-[var(--color-selection)] p-4">
        <a
          href="/login"
          className="flex items-center gap-2 text-[16px] leading-[1.3] font-medium text-[var(--color-black)]"
        >
          <Icon name="user" variant="scroll" size={24} />
          Войти / Зарегистрироваться
        </a>
        <a
          href="/boutiques"
          className="flex items-center gap-2 text-[16px] leading-[1.3] font-medium text-[var(--color-black)]"
        >
          <Icon name="location" size={24} />
          Бутики
        </a>
      </div>

      {/* Категории */}
      <div className="flex flex-col gap-6 px-4 pt-6">
        {catalogCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryClick(cat.id)}
            className="flex items-center gap-2 text-left text-[var(--color-black)]"
          >
            <Icon name={cat.icon as IconName} size={24} className="shrink-0" />
            <span className="flex-1 text-[16px] leading-[1.3] font-medium">{cat.label}</span>
            <Icon name="chevronRight" size={20} className="shrink-0" />
          </button>
        ))}
      </div>

      {/* Допссылки */}
      <div className="mx-4 mt-8 flex flex-col gap-4 border-t border-[var(--color-gray-light)] px-4 pt-8">
        {catalogExtraLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center justify-between text-[16px] leading-[1.3] font-medium text-[var(--color-black)]"
          >
            {link.label}
            {link.hasSubmenu && <Icon name="chevronDown" variant="scroll" size={20} />}
          </a>
        ))}
      </div>

      {/* Информационный блок */}
      <div className="mx-4 mt-8 mb-4 flex flex-col gap-4 bg-[var(--color-gray-light)] p-4">
        {catalogInfoLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center justify-between text-[16px] leading-[1.3] font-medium text-[var(--color-black)]"
          >
            {link.label}
            {link.hasSubmenu && <Icon name="chevronRight" size={20} />}
          </a>
        ))}
      </div>
    </div>
  );
}

function MobileCategoryLevel({
  category,
  expandedFilter,
  onToggleFilter,
  onBack,
}: {
  category: CatalogCategory;
  expandedFilter: string;
  onToggleFilter: (title: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Заголовок с кнопкой назад */}
      <div className="flex items-center gap-3 border-b border-[var(--color-gray-light)] px-4 py-4">
        <button type="button" onClick={onBack} className="shrink-0" aria-label="Назад">
          <Icon name="chevronRight" size={20} className="rotate-180" />
        </button>
        <span className="text-[16px] leading-[1.3] font-medium text-[var(--color-black)]">
          {category.label}
        </span>
      </div>

      <div className="flex flex-col gap-0 px-4 pt-4">
        {/* Все товары */}
        <a
          href={category.href}
          className="py-3 text-[16px] leading-[1.3] text-[var(--color-black)]"
        >
          Все товары
        </a>

        {/* Категории (аккордеон) */}
        {category.subcategories && (
          <div className="border-t border-[var(--color-gray-light)]">
            <button
              type="button"
              onClick={() => onToggleFilter("Категории")}
              className="flex w-full items-center justify-between py-3"
            >
              <span className="text-[16px] leading-[1.3] font-medium text-[var(--color-black)]">
                Категории
              </span>
              <Icon
                name="chevronDown"
                variant="scroll"
                size={20}
                className={`transition-transform ${
                  expandedFilter === "Категории" ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedFilter === "Категории" && (
              <div className="flex flex-col gap-3 pb-3 pl-4">
                {category.subcategories.map((sub) => (
                  <a
                    key={sub.label}
                    href={sub.href}
                    className="text-[14px] leading-[1.3] text-[var(--color-dark)]"
                  >
                    {sub.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Фильтры (каждый — аккордеон) */}
        {category.filters?.map((filter) => (
          <div key={filter.title} className="border-t border-[var(--color-gray-light)]">
            <button
              type="button"
              onClick={() => onToggleFilter(filter.title)}
              className="flex w-full items-center justify-between py-3"
            >
              <span className="text-[16px] leading-[1.3] text-[var(--color-black)]">
                {filter.title}
              </span>
              <Icon
                name="chevronDown"
                variant="scroll"
                size={20}
                className={`transition-transform ${
                  expandedFilter === filter.title ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedFilter === filter.title && (
              <div className="flex flex-col gap-3 pb-3 pl-4">
                {filter.options.map((opt) => (
                  <a
                    key={opt.label + opt.href}
                    href={opt.href}
                    className="text-[14px] leading-[1.3] text-[var(--color-dark)]"
                  >
                    {opt.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Новинки */}
        <div className="border-t border-[var(--color-gray-light)]">
          <a
            href={`${category.href}?new=true`}
            className="block py-3 text-[16px] leading-[1.3] text-[var(--color-black)]"
          >
            Новинки
          </a>
        </div>

        {/* Ссылка на коллекции */}
        <div className="pt-2 pb-4">
          <Link
            href="/collections"
            className="text-[14px] leading-[1.3] text-[var(--color-brand)] underline"
          >
            Смотреть коллекции
          </Link>
        </div>

        {/* Промо картинка */}
        <div className="relative aspect-[343/200] pb-6">
          <Image
            src="/assets/figma/placeholder.svg"
            alt=""
            fill
            unoptimized
            className="rounded object-cover"
          />
        </div>
      </div>
    </div>
  );
}
