"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";

export function Certificate() {
  return (
    <section className="relative bg-[var(--color-gold)] overflow-hidden md:h-auto desktop:h-[660px]">
      <div className="relative mx-auto max-w-[1400px] px-4 py-10 md:px-[39px] desktop:px-0 desktop:py-0 desktop:h-full">
        <div className="flex flex-col gap-8 md:flex-row md:items-stretch desktop:h-full">
          <div className="relative h-[280px] w-full overflow-hidden md:h-[343px] md:w-1/2 md:shrink-0 desktop:h-auto desktop:w-[620px] desktop:shrink-0">
            <Image
              src="/assets/figma/certificate/certificate.jpg"
              alt="Подарочный сертификат"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex items-center desktop:py-0 py-4">
            <div className="flex flex-col gap-8 max-w-[495px]">
              <div className="flex flex-col gap-6">
                <h2 className="text-[26px] font-medium leading-[1.1] desktop:text-[40px]">
                  Подарок, которому будет рад каждый
                </h2>
                <p className="text-sm text-[var(--color-dark)] leading-[1.3] desktop:text-base max-w-[420px]">
                  Хотите сделать приятный сюрприз для близкого, но не знаете, что
                  выбрать? Наш подарочный сертификат позволит вам легко и быстро
                  решить эту проблему.
                </p>
              </div>
              <div>
                <Button variant="primary" type="button">
                  Выбрать сертификат
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
