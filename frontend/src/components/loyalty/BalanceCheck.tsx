"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";
import { balanceCheck as defaultBalanceCheck } from "@/data/loyalty";

type BalanceCheckData = {
  title: string;
  description: string;
  buttonLabel: string;
  image: string;
};

type BalanceCheckProps = {
  data?: BalanceCheckData;
};

export function BalanceCheck({ data }: BalanceCheckProps) {
  const balanceCheck = data ?? defaultBalanceCheck;
  return (
    <section className="desktop:px-0 mx-auto w-full max-w-[1400px] px-4 md:px-[39px]">
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="desktop:px-14 desktop:py-0 desktop:min-h-[660px] flex min-h-[400px] flex-col items-center justify-center bg-[var(--color-gray-light)] p-8 text-center md:w-1/2 md:p-10">
          <h2 className="desktop:text-[40px] text-[22px] leading-[1.1] font-medium text-[var(--color-foreground)] md:text-[26px]">
            {balanceCheck.title}
          </h2>
          <p className="desktop:mt-6 desktop:text-base mt-4 max-w-[408px] text-sm leading-[1.3] text-[var(--color-dark)]">
            {balanceCheck.description}
          </p>
          <div className="desktop:mt-8 mt-6 w-full max-w-[423px]">
            <Button variant="primary" type="button" fullWidth className="!justify-between !px-8">
              <span>{balanceCheck.buttonLabel}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="desktop:min-h-[660px] relative min-h-[400px] bg-[var(--color-gold)] md:w-1/2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="desktop:w-[394px] desktop:h-[200px] relative h-[160px] w-[300px] overflow-hidden rounded-[5px]">
              <Image
                src={balanceCheck.image}
                alt="Бонусная карта"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="desktop:text-[64px] text-[48px] leading-[1.1] font-medium text-[var(--color-brand)]">
                  +300
                </span>
                <span className="desktop:text-lg text-sm leading-[1.1] font-medium text-[var(--color-brand)]">
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
