"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/design-system/icons";
import { CatalogMenu } from "@/components/catalog/CatalogMenu";
import { useAuthModal } from "@/components/auth";

type HeaderProps = {
  variant?: "transparent" | "solid";
};

export function Header({ variant = "transparent" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const { openLogin } = useAuthModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const useDarkStyle = variant === "solid" || isScrolled;

  const bottomBarBg = useDarkStyle
    ? "bg-[var(--color-light)] shadow-md"
    : "bg-transparent";
  const bottomBarText = useDarkStyle
    ? "text-[var(--color-black)]"
    : "text-[var(--color-light)]";
  const bottomBarIconVariant = useDarkStyle ? "scroll" : "default";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[var(--color-light)] md:bg-transparent">
      {/* ===== DESKTOP (1400px+): Top bar ===== */}
      <div className="hidden desktop:block bg-[var(--color-brown)] text-[var(--color-light)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between py-2">
          <div className="flex items-center gap-12 whitespace-nowrap">
            <Icon name="logo" variant="scroll" size={173} height={31} alt="Vita Brava Home" />
            <nav className="flex items-center gap-6 text-sm leading-[1.3]">
              <a href="/about" className="hover:opacity-80 transition-opacity">
                О бренде
              </a>
              <a href="/news" className="hover:opacity-80 transition-opacity">
                Новости
              </a>
              <a href="/special-offers" className="hover:opacity-80 transition-opacity">
                Специальные предложения
              </a>
              <a href="/customer-info" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                Покупателям
                <Icon name="chevronDown" size={24} />
              </a>
              <a href="/cooperation" className="hover:opacity-80 transition-opacity">
                Сотрудничество
              </a>
              <a href="/contacts" className="hover:opacity-80 transition-opacity">
                Контакты
              </a>
              <a href="/contacts" className="hover:opacity-80 transition-opacity">
                Бутики
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-base leading-[1.3]">8 800 888-80-80</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Telegram"
              >
                <Icon name="telegram" size={24} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="WhatsApp"
              >
                <Icon name="whatsapp" size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP (1400px+): Bottom bar ===== */}
      <div className={`hidden desktop:block transition-all duration-300 ${bottomBarBg} ${bottomBarText}`}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-2 py-4">
          <div className="flex items-center gap-[47px] text-sm leading-[1.3] whitespace-nowrap overflow-hidden h-8">
            <button
              type="button"
              onClick={() => setCatalogOpen(!catalogOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Icon name={catalogOpen ? "close" : "burger"} variant={bottomBarIconVariant} size={24} />
              <span>Каталог</span>
            </button>
            <nav className="flex items-center gap-8">
              <a href="#" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                Постельное белье
                <Icon name="chevronDown" variant={bottomBarIconVariant} size={24} />
              </a>
              <a href="#" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                Домашний текстиль
                <Icon name="chevronDown" variant={bottomBarIconVariant} size={24} />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">Одеяла</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Подушки</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Пледы</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Полотенца</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Будуарные наряды</a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                Подарочные сертификаты
              </a>
            </nav>
          </div>
          <div className="flex items-start gap-2">
            <button
              type="button"
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Поиск"
            >
              <Icon name="search" variant={bottomBarIconVariant} size={24} />
            </button>
            <button
              type="button"
              onClick={openLogin}
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Профиль"
            >
              <Icon name="user" variant={bottomBarIconVariant} size={24} />
            </button>
            <div className="flex items-center">
              <button
                type="button"
                className="flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Избранное"
              >
                <Icon name="favorite" variant={bottomBarIconVariant} size={24} />
              </button>
              <div className="flex h-6 items-end justify-center pb-[14px]">
                <span className="text-xs leading-[1.1]">(0)</span>
              </div>
            </div>
            <div className="flex items-center pr-[3px]">
              <button
                type="button"
                className="-mr-[3px] flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Корзина"
              >
                <Icon name="bag" variant={bottomBarIconVariant} size={24} />
              </button>
              <div className="-mr-[3px] flex h-6 items-end justify-center pb-[14px]">
                <span className="text-xs leading-[1.1]">(0)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABLET (768px–1399px): Top bar ===== */}
      <div className="max-md:hidden desktop:hidden bg-[var(--color-brown)] text-[var(--color-light)]">
        <div className="flex items-center justify-between px-[39px] py-2">
          <div className="flex items-center gap-12">
            <Icon name="logo" variant="scroll" size={145} height={25} alt="Vita Brava Home" />
            <nav className="flex items-center gap-8 text-sm leading-[1.3]">
              <a href="/customer-info" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                Покупателям
                <Icon name="chevronDown" size={24} />
              </a>
              <a href="/contacts" className="hover:opacity-80 transition-opacity">
                Контакты
              </a>
              <a href="/contacts" className="hover:opacity-80 transition-opacity">
                Бутики
              </a>
            </nav>
          </div>
          <span className="text-base leading-[1.3]">8 800 888-80-80</span>
        </div>
      </div>

      {/* ===== TABLET (768px–1399px): Bottom bar ===== */}
      <div className={`max-md:hidden desktop:hidden transition-all duration-300 ${bottomBarBg} ${bottomBarText}`}>
        <div className="flex items-center justify-between px-[39px] py-2 h-10">
          <button
            type="button"
            onClick={() => setCatalogOpen(!catalogOpen)}
            className="flex items-center gap-2 text-sm leading-[1.3] hover:opacity-80 transition-opacity"
          >
            <Icon name={catalogOpen ? "close" : "burger"} variant={bottomBarIconVariant} size={24} />
            <span>Каталог</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Поиск"
            >
              <Icon name="search" variant={bottomBarIconVariant} size={24} />
            </button>
            <button
              type="button"
              onClick={openLogin}
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Профиль"
            >
              <Icon name="user" variant={bottomBarIconVariant} size={24} />
            </button>
            <div className="flex items-center">
              <button
                type="button"
                className="flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Избранное"
              >
                <Icon name="favorite" variant={bottomBarIconVariant} size={24} />
              </button>
              <span className="text-xs leading-[1.1] self-start mt-0.5">(0)</span>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Корзина"
              >
                <Icon name="bag" variant={bottomBarIconVariant} size={24} />
              </button>
              <span className="text-xs leading-[1.1] self-start mt-0.5">(0)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE (<768px) ===== */}
      <div className="md:hidden">
        <div className="bg-[var(--color-brown)] text-[var(--color-light)] h-10 flex items-center justify-center overflow-hidden">
          <span className="text-sm leading-[1.3]">Летние коллекции уже в наличии</span>
        </div>
        <div className="flex items-center justify-between px-4 bg-[var(--color-light)] text-[var(--color-black)]">
          <div className="flex items-center gap-[10px] py-[10px]">
            <button
              type="button"
              onClick={() => setCatalogOpen(!catalogOpen)}
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Меню"
            >
              <Icon name={catalogOpen ? "close" : "burger"} variant="scroll" size={24} />
            </button>
            <button
              type="button"
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Поиск"
            >
              <Icon name="search" variant="scroll" size={24} />
            </button>
          </div>
          <Icon name="logo" variant="scroll" size={170} height={27} alt="Vita Brava Home" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Избранное"
            >
              <Icon name="favorite" variant="scroll" size={24} />
            </button>
            <button
              type="button"
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Корзина"
            >
              <Icon name="bag" variant="scroll" size={24} />
            </button>
          </div>
        </div>
      </div>

      <CatalogMenu
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
      />
    </header>
  );
}
