"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";

export function Designers() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 md:px-[39px] desktop:px-0 desktop:py-[80px]">
      <div className="grid gap-2 md:grid-cols-2 desktop:grid-cols-2">
        <div className="flex items-center justify-center bg-[var(--color-selection)] px-6 py-16 text-center desktop:px-[56px] md:h-[343px] desktop:h-[660px]">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col gap-6 items-center">
              <h2 className="text-[26px] font-medium leading-[1.1] desktop:text-[40px] max-w-[541px]">
                Приглашаем
                <br />
                к сотрудничеству
              </h2>
              <p className="text-sm text-[var(--color-dark)] leading-[1.3] desktop:text-base max-w-[442px]">
                Дизайнеров интерьеров, владельцев отелей, декораторов,
                хоумстейджеров и всех заинтересованных
              </p>
            </div>
            <Button variant="primary" type="button">
              Узнать условия
            </Button>
          </div>
        </div>
        <div className="relative h-[343px] desktop:h-[660px]">
          <Image
            src="/assets/figma/designers/designers.jpg"
            alt="Дизайнерам"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
