"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { loyaltyHero as defaultLoyaltyHero } from "@/data/loyalty";

const breadcrumbs = [{ label: "Главная", href: "/" }, { label: "Программа лояльности" }];

type LoyaltyHeroData = {
  title: string;
  description: string;
  buttonLabel: string;
  image: string;
};

type LoyaltyHeroProps = {
  data?: LoyaltyHeroData;
};

export function LoyaltyHero({ data }: LoyaltyHeroProps) {
  const loyaltyHero = data ?? defaultLoyaltyHero;
  return (
    <section className="relative overflow-hidden bg-[var(--color-selection)]">
      <div className="desktop:px-0 desktop:min-h-[600px] relative mx-auto min-h-[400px] max-w-[1400px] px-4 md:min-h-[480px] md:px-[39px]">
        <div className="desktop:pt-8 pt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <div className="desktop:py-12 flex max-w-[500px] flex-col justify-center py-8 md:py-10">
          <h1 className="desktop:text-[40px] text-[30px] leading-[1.1] font-medium text-[var(--color-foreground)] md:text-[36px]">
            {loyaltyHero.title}
          </h1>
          <p className="desktop:mt-6 desktop:text-base mt-4 text-sm leading-[1.3] text-[var(--color-dark)]">
            {loyaltyHero.description}
          </p>
          <div className="desktop:mt-8 mt-6">
            <Button variant="primary" type="button">
              {loyaltyHero.buttonLabel}
            </Button>
          </div>
        </div>
      </div>
      <div className="desktop:w-[55%] absolute top-0 right-0 hidden h-full w-[50%] md:block">
        <Image
          src={loyaltyHero.image}
          alt="Программа лояльности"
          fill
          className="object-cover object-center"
          unoptimized
        />
      </div>
      <div className="relative h-[300px] w-full md:hidden">
        <Image
          src={loyaltyHero.image}
          alt="Программа лояльности"
          fill
          className="object-cover object-center"
          unoptimized
        />
      </div>
    </section>
  );
}
