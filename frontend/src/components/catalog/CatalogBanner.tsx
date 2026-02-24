"use client";

import { Button } from "@/design-system/components";

type CatalogBannerProps = {
  className?: string;
};

export function CatalogBanner({ className }: CatalogBannerProps) {
  return (
    <section
      className={`relative w-full overflow-hidden bg-[var(--color-dark-gray)] ${className || ""}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url(/assets/figma/placeholder.svg)" }}
      />
      <div className="desktop:px-[260px] desktop:py-[100px] relative z-10 flex flex-col items-start justify-center px-6 py-16 md:px-[39px] md:py-[60px]">
        <h2 className="desktop:text-[40px] desktop:leading-tight max-w-[500px] text-2xl font-medium text-[var(--color-light)]">
          Соберите свой комплект белья от&nbsp;VITA BRAVA HOME
        </h2>
        <p className="desktop:text-base mt-4 max-w-[460px] text-sm text-[var(--color-light)] opacity-80">
          Выбирайте из&nbsp;лучших коллекций постельного белья, подушек и&nbsp;домашнего текстиля
          для&nbsp;вашего уюта и&nbsp;комфорта.
        </p>
        <Button variant="primary" className="mt-8">
          Перейти в каталог
        </Button>
      </div>
    </section>
  );
}
