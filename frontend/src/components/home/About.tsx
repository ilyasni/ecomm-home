"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";

export function About() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 md:px-[39px] desktop:px-0 desktop:py-[80px]">
      <div className="grid gap-2 md:grid-cols-2 desktop:grid-cols-2">
        <div className="flex items-center justify-center bg-[var(--color-selection)] px-6 py-16 text-center desktop:px-[78px] md:h-[343px] desktop:h-[688px]">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col gap-6">
              <h2 className="text-[26px] font-medium leading-[1.1] desktop:text-[32px]">
                VITA BRAVA HOME – премиальное качество по доступной цене
              </h2>
              <p className="text-sm text-[var(--color-dark)] leading-[1.3] desktop:text-base max-w-[540px]">
                Создаем текстиль, который позволяет вам отдыхать в атмосфере
                роскоши: мягкие пледы, нежные подушки, изысканное постельное бельё
                и элегантные будуарные наряды.
              </p>
            </div>
            <Button variant="primary" type="button">
              Смотреть каталог
            </Button>
          </div>
        </div>
        <div className="relative h-[343px] desktop:h-[688px]">
          <Image
            src="/assets/figma/about/about.jpg"
            alt="О нас"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
