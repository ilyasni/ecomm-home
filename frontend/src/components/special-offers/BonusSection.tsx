"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";
import { bonusSection as defaultBonusSection } from "@/data/special-offers";

type BonusSectionData = {
  title: string;
  description: string;
  buttonLabel: string;
  image: string;
};

type BonusSectionProps = {
  data?: BonusSectionData;
};

export function BonusSection({ data }: BonusSectionProps) {
  const bonusSection = data ?? defaultBonusSection;
  return (
    <div className="flex flex-col md:flex-row">
      <div className="desktop:p-16 flex flex-col justify-center bg-[var(--color-selection)] p-8 md:w-1/2 md:p-10">
        <h2 className="desktop:text-[32px] text-[22px] leading-[1.1] font-medium md:text-[26px]">
          {bonusSection.title}
        </h2>
        <p className="desktop:text-base mt-6 max-w-[512px] text-sm leading-[1.5] text-[var(--color-dark)]">
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
