"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";

interface AboutProps {
  image?: string;
}

export function About({ image }: AboutProps = {}) {
  return (
    <section className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="desktop:px-[78px] desktop:h-[688px] flex items-center justify-center bg-[var(--color-selection)] px-6 py-16 text-center md:h-[343px]">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col gap-6">
              <h2 className="desktop:text-[32px] text-[26px] leading-[1.1] font-medium">
                VITA BRAVA HOME – премиальное качество по доступной цене
              </h2>
              <p className="desktop:text-base max-w-[540px] text-sm leading-[1.3] text-[var(--color-dark)]">
                Создаем текстиль, который позволяет вам отдыхать в атмосфере роскоши: мягкие пледы,
                нежные подушки, изысканное постельное бельё и элегантные будуарные наряды.
              </p>
            </div>
            <Button variant="primary" type="button">
              Смотреть каталог
            </Button>
          </div>
        </div>
        <div className="desktop:h-[688px] relative h-[343px]">
          <Image
            src={image || "/assets/figma/placeholder.svg"}
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
