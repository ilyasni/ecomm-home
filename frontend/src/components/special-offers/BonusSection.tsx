"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";
import { bonusSection } from "@/data/special-offers";

export function BonusSection() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-col justify-center bg-[var(--color-selection)] p-8 md:p-10 desktop:p-16 md:w-1/2">
        <h2 className="text-[22px] md:text-[26px] desktop:text-[32px] font-medium leading-[1.1]">
          {bonusSection.title}
        </h2>
        <p className="mt-6 text-sm text-[var(--color-dark)] leading-[1.5] desktop:text-base max-w-[512px]">
          {bonusSection.description}
        </p>
        <div className="mt-8">
          <Button variant="primary" type="button">
            {bonusSection.buttonLabel}
          </Button>
        </div>
      </div>
      <div className="relative h-[340px] md:h-auto md:w-1/2">
        <Image
          src={bonusSection.image}
          alt="Бонусная программа"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    </div>
  );
}
