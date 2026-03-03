"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/design-system/icons";
import { CatalogMenu } from "@/components/catalog/CatalogMenu";
import { useAuthModal, useAuthSession } from "@/components/auth";
import type { NavigationData } from "@/lib/queries/navigation";
import type { StrapiCategoryRaw } from "@/lib/queries/catalog";
import { getCartCount, getFavoritesCount, subscribeCommerce } from "@/lib/commerce";

const defaultTopMenuItems = [
  { label: "О бренде", href: "/about" },
  { label: "Новости", href: "/news" },
  { label: "Специальные предложения", href: "/special-offers" },
  { label: "Покупателям", href: "/customer-info" },
  { label: "Сотрудничество", href: "/cooperation" },
  { label: "Контакты", href: "/contacts" },
  { label: "Бутики", href: "/boutiques" },
];

const defaultCatalogLinks = [
  { label: "Постельное белье", href: "/catalog/bed-linen", hasSubmenu: true },
  { label: "Домашний текстиль", href: "/catalog/home-textile", hasSubmenu: true },
  { label: "Одеяла", href: "/catalog/blankets" },
  { label: "Подушки", href: "/catalog/pillows" },
  { label: "Пледы", href: "/catalog/plaids" },
  { label: "Полотенца", href: "/catalog/towels" },
  { label: "Будуарные наряды", href: "/catalog/boudoir" },
  { label: "Подарочные сертификаты", href: "/catalog/gift-certificates" },
];

function normalizeCatalogHref(href: string, label: string, availableSlugs: Set<string>): string {
  const trimmed = href.trim();
  if (!trimmed.startsWith("/catalog/")) return trimmed;

  const currentSlug = trimmed.replace("/catalog/", "").split("?")[0].split("/")[0];
  if (availableSlugs.has(currentSlug)) return trimmed;

  const slugAliasBySlug: Record<string, string> = {
    "home-textile": "home",
    plaids: "throws",
  };
  const slugAliasByLabel: Record<string, string> = {
    "домашний текстиль": "home",
    "пледы": "throws",
  };

  const normalizedLabel = label.toLowerCase().trim();
  const resolvedSlug = slugAliasBySlug[currentSlug] ?? slugAliasByLabel[normalizedLabel];
  if (!resolvedSlug || !availableSlugs.has(resolvedSlug)) return trimmed;

  return trimmed.replace(`/catalog/${currentSlug}`, `/catalog/${resolvedSlug}`);
}

type HeaderProps = {
  variant?: "transparent" | "solid";
  navigation?: NavigationData | null;
  catalogData?: StrapiCategoryRaw[] | null;
};

export function Header({ variant = "transparent", navigation, catalogData }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const { openLogin } = useAuthModal();
  const { user } = useAuthSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sync = () => {
      setFavoritesCount(getFavoritesCount());
      setCartCount(getCartCount());
    };
    sync();
    return subscribeCommerce(sync);
  }, []);

  const useDarkStyle = variant === "solid" || isScrolled;

  const bottomBarBg = useDarkStyle ? "bg-[var(--color-light)] shadow-md" : "bg-transparent";
  const bottomBarText = useDarkStyle ? "text-[var(--color-black)]" : "text-[var(--color-light)]";
  const bottomBarIconVariant = useDarkStyle ? "scroll" : "default";

  const topMenuItems = navigation?.topMenuItems ?? defaultTopMenuItems;
  const availableSlugs = new Set((catalogData ?? []).map((category) => category.slug));
  const catalogCategories = (navigation?.catalogCategories ?? defaultCatalogLinks).map((category) => ({
    ...category,
    href: normalizeCatalogHref(category.href, category.label, availableSlugs),
  }));
  const phone = navigation?.phone ?? "8 800 888-80-80";
  const topBarText = navigation?.topBarText ?? "Летние коллекции уже в наличии";
  const telegramUrl = navigation?.telegramUrl ?? "#";
  const whatsappUrl = navigation?.whatsappUrl ?? "#";

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[var(--color-light)] md:bg-transparent">
      {/* ===== DESKTOP (1400px+): Top bar ===== */}
      <div className="desktop:block hidden bg-[var(--color-brown)] text-[var(--color-light)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between py-2">
          <div className="flex items-center gap-12 whitespace-nowrap">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
              <Icon name="logo" variant="scroll" size={173} height={31} alt="Vita Brava Home" />
            </Link>
            <nav className="flex items-center gap-6 text-sm leading-[1.3]">
              {topMenuItems.map((item, idx) => (
                <a
                  key={`${item.href}-${idx}`}
                  href={item.href}
                  className="transition-opacity hover:opacity-80"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-base leading-[1.3]">{phone}</span>
            <div className="flex items-center gap-3">
              <a
                href={telegramUrl}
                className="flex items-center justify-center transition-opacity hover:opacity-80"
                aria-label="Telegram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="telegram" size={24} />
              </a>
              <a
                href={whatsappUrl}
                className="flex items-center justify-center transition-opacity hover:opacity-80"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="whatsapp" size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP (1400px+): Bottom bar ===== */}
      <div
        className={`desktop:block hidden transition-all duration-300 ${bottomBarBg} ${bottomBarText}`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-2 py-4">
          <div className="flex h-8 items-center gap-[47px] overflow-hidden text-sm leading-[1.3] whitespace-nowrap">
            <button
              type="button"
              onClick={() => setCatalogOpen(!catalogOpen)}
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Icon
                name={catalogOpen ? "burgerActive" : "burger"}
                variant={bottomBarIconVariant}
                size={24}
              />
              <span>Каталог</span>
            </button>
            <nav className="flex items-center gap-8">
              {catalogCategories.map((cat, idx) => (
                <a
                  key={`${cat.href}-${idx}`}
                  href={cat.href}
                  className={`transition-opacity hover:opacity-80 ${cat.hasSubmenu ? "flex items-center gap-1" : ""}`}
                >
                  {cat.label}
                  {cat.hasSubmenu && (
                    <Icon name="chevronDown" variant={bottomBarIconVariant} size={24} />
                  )}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-start gap-2">
            <Link
              href="/search"
              className="flex items-center justify-center transition-opacity hover:opacity-80"
              aria-label="Поиск"
            >
              <Icon name="search" variant={bottomBarIconVariant} size={24} />
            </Link>
            <button
              type="button"
              onClick={() => {
                if (user) {
                  router.push("/account");
                  return;
                }
                openLogin();
              }}
              className="flex items-center justify-center transition-opacity hover:opacity-80"
              aria-label="Профиль"
            >
              <Icon name="user" variant={bottomBarIconVariant} size={24} />
            </button>
            <div className="flex items-center">
              <Link
                href="/favorites"
                className="flex items-center justify-center transition-opacity hover:opacity-80"
                aria-label="Избранное"
              >
                <Icon name="favorite" variant={bottomBarIconVariant} size={24} />
              </Link>
              <div className="flex h-6 items-end justify-center pb-[14px]">
                <span className="text-xs leading-[1.1]">({favoritesCount})</span>
              </div>
            </div>
            <div className="flex items-center pr-[3px]">
              <Link
                href="/cart"
                className="-mr-[3px] flex items-center justify-center transition-opacity hover:opacity-80"
                aria-label="Корзина"
              >
                <Icon name="bag" variant={bottomBarIconVariant} size={24} />
              </Link>
              <div className="-mr-[3px] flex h-6 items-end justify-center pb-[14px]">
                <span className="text-xs leading-[1.1]">({cartCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABLET (768px–1399px): Top bar ===== */}
      <div className="desktop:hidden bg-[var(--color-brown)] text-[var(--color-light)] max-md:hidden">
        <div className="flex items-center justify-between px-[39px] py-2">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
              <Icon name="logo" variant="scroll" size={145} height={25} alt="Vita Brava Home" />
            </Link>
            <nav className="flex items-center gap-8 text-sm leading-[1.3]">
              <a
                href="/customer-info"
                className="flex items-center gap-1 transition-opacity hover:opacity-80"
              >
                Покупателям
                <Icon name="chevronDown" size={24} />
              </a>
              <a href="/contacts" className="transition-opacity hover:opacity-80">
                Контакты
              </a>
              <a href="/boutiques" className="transition-opacity hover:opacity-80">
                Бутики
              </a>
            </nav>
          </div>
          <span className="text-base leading-[1.3]">{phone}</span>
        </div>
      </div>

      {/* ===== TABLET (768px–1399px): Bottom bar ===== */}
      <div
        className={`desktop:hidden transition-all duration-300 max-md:hidden ${bottomBarBg} ${bottomBarText}`}
      >
        <div className="flex h-10 items-center justify-between px-[39px] py-2">
          <button
            type="button"
            onClick={() => setCatalogOpen(!catalogOpen)}
            className="flex items-center gap-2 text-sm leading-[1.3] transition-opacity hover:opacity-80"
          >
            <Icon
              name={catalogOpen ? "burgerActive" : "burger"}
              variant={bottomBarIconVariant}
              size={24}
            />
            <span>Каталог</span>
          </button>
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="flex items-center justify-center transition-opacity hover:opacity-80"
              aria-label="Поиск"
            >
              <Icon name="search" variant={bottomBarIconVariant} size={24} />
            </Link>
            <button
              type="button"
              onClick={() => {
                if (user) {
                  router.push("/account");
                  return;
                }
                openLogin();
              }}
              className="flex items-center justify-center transition-opacity hover:opacity-80"
              aria-label="Профиль"
            >
              <Icon name="user" variant={bottomBarIconVariant} size={24} />
            </button>
            <div className="flex items-center">
              <Link
                href="/favorites"
                className="flex items-center justify-center transition-opacity hover:opacity-80"
                aria-label="Избранное"
              >
                <Icon name="favorite" variant={bottomBarIconVariant} size={24} />
              </Link>
              <span className="mt-0.5 self-start text-xs leading-[1.1]">({favoritesCount})</span>
            </div>
            <div className="flex items-center">
              <Link
                href="/cart"
                className="flex items-center justify-center transition-opacity hover:opacity-80"
                aria-label="Корзина"
              >
                <Icon name="bag" variant={bottomBarIconVariant} size={24} />
              </Link>
              <span className="mt-0.5 self-start text-xs leading-[1.1]">({cartCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE (<768px) ===== */}
      <div className="md:hidden">
        <div className="flex h-10 items-center justify-center overflow-hidden bg-[var(--color-brown)] text-[var(--color-light)]">
          <span className="text-sm leading-[1.3]">{topBarText}</span>
        </div>
        <div className="flex items-center justify-between bg-[var(--color-light)] px-4 text-[var(--color-black)]">
          <div className="flex items-center gap-[10px] py-[10px]">
            <button
              type="button"
              onClick={() => setCatalogOpen(!catalogOpen)}
              className="flex items-center justify-center transition-opacity hover:opacity-80"
              aria-label="Меню"
            >
              <Icon name={catalogOpen ? "burgerActive" : "burger"} variant="scroll" size={24} />
            </button>
            <Link
              href="/search"
              className="flex items-center justify-center transition-opacity hover:opacity-80"
              aria-label="Поиск"
            >
              <Icon name="search" variant="scroll" size={24} />
            </Link>
          </div>
          <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
            <Icon name="logo" variant="scroll" size={145} height={23} alt="Vita Brava Home" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/favorites"
              className="flex items-center justify-center transition-opacity hover:opacity-80"
              aria-label="Избранное"
            >
              <Icon name="favorite" variant="scroll" size={24} />
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-center transition-opacity hover:opacity-80"
              aria-label="Корзина"
            >
              <Icon name="bag" variant="scroll" size={24} />
            </Link>
          </div>
        </div>
      </div>

      <CatalogMenu
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        catalogData={catalogData}
      />
    </header>
  );
}
