"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { loyaltyHero } from "@/data/loyalty";

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Программа лояльности" },
];

export function LoyaltyHero() {
  return (
    <section className="relative bg-[var(--color-selection)] overflow-hidden">
      <div className="relative mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 min-h-[400px] md:min-h-[480px] desktop:min-h-[600px]">
        <div className="pt-6 desktop:pt-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <div className="flex flex-col justify-center py-8 md:py-10 desktop:py-12 max-w-[500px]">
          <h1 className="text-[30px] md:text-[36px] desktop:text-[40px] font-medium leading-[1.1] text-[var(--color-foreground)]">
            {loyaltyHero.title}
          </h1>
          <p className="mt-4 desktop:mt-6 text-sm desktop:text-base leading-[1.3] text-[var(--color-dark)]">
            {loyaltyHero.description}
          </p>
          <div className="mt-6 desktop:mt-8">
            <Button variant="primary" type="button">
              {loyaltyHero.buttonLabel}
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden md:block absolute top-0 right-0 h-full w-[50%] desktop:w-[55%]">
        <Image
          src={loyaltyHero.image}
          alt="Программа лояльности"
          fill
          className="object-cover object-center"
          unoptimized
        />
      </div>
      <div className="md:hidden relative h-[300px] w-full">
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
