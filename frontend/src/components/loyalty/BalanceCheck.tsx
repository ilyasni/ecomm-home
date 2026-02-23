"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";
import { balanceCheck } from "@/data/loyalty";

export function BalanceCheck() {
  return (
    <section className="w-full mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex flex-col items-center justify-center text-center bg-[var(--color-gray-light)] p-8 md:p-10 desktop:px-14 desktop:py-0 md:w-1/2 min-h-[400px] desktop:min-h-[660px]">
          <h2 className="text-[22px] md:text-[26px] desktop:text-[40px] font-medium leading-[1.1] text-[var(--color-foreground)]">
            {balanceCheck.title}
          </h2>
          <p className="mt-4 desktop:mt-6 text-sm desktop:text-base text-[var(--color-dark)] leading-[1.3] max-w-[408px]">
            {balanceCheck.description}
          </p>
          <div className="mt-6 desktop:mt-8 w-full max-w-[423px]">
            <Button variant="primary" type="button" fullWidth className="!justify-between !px-8">
              <span>{balanceCheck.buttonLabel}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="relative md:w-1/2 min-h-[400px] desktop:min-h-[660px] bg-[var(--color-gold)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[300px] h-[160px] desktop:w-[394px] desktop:h-[200px] rounded-[5px] overflow-hidden">
              <Image
                src={balanceCheck.image}
                alt="Бонусная карта"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[48px] desktop:text-[64px] font-medium leading-[1.1] text-[var(--color-brand)]">
                  +300
                </span>
                <span className="text-sm desktop:text-lg font-medium leading-[1.1] text-[var(--color-brand)]">
                  бонусных баллов
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
