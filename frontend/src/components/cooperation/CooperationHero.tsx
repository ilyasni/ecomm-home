"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";
import { ArrowLink } from "@/design-system/components";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { cooperationHero } from "@/data/cooperation";

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Сотрудничество" },
];

export function CooperationHero() {
  return (
    <section className="relative h-[500px] md:h-[503px] desktop:h-[700px] overflow-hidden">
      <Image
        src={cooperationHero.desktopImage}
        alt="Сотрудничество"
        fill
        className="hidden object-cover desktop:block"
        priority
        unoptimized
      />
      <Image
        src={cooperationHero.mobileImage}
        alt="Сотрудничество"
        fill
        className="object-cover desktop:hidden"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-[rgba(17,10,0,0.35)]" />

      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col px-4 md:px-[39px] desktop:px-0">
        <div className="mt-4 desktop:mt-8">
          <Breadcrumbs items={breadcrumbs} variant="light" />
        </div>
        <div className="mt-auto mb-10 desktop:mb-16 max-w-[500px] text-[var(--color-light)]">
          <h1 className="text-[26px] md:text-[32px] desktop:text-[40px] font-medium leading-[1.1] whitespace-pre-line">
            {cooperationHero.title}
          </h1>
          <p className="mt-4 text-sm leading-[1.3] desktop:text-base opacity-90">
            {cooperationHero.subtitle}
          </p>
          <div className="mt-6">
            <ArrowLink label={cooperationHero.buttonLabel} size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
