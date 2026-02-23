"use client";

import Image from "next/image";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { aboutHero } from "@/data/about";

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "О бренде" },
];

export function AboutHero() {
  return (
    <section className="relative h-[420px] md:h-[503px] desktop:h-[700px] overflow-hidden">
      <Image
        src={aboutHero.desktopImage}
        alt="О бренде Vita Brava Home"
        fill
        className="hidden object-cover desktop:block"
        priority
        unoptimized
      />
      <Image
        src={aboutHero.mobileImage}
        alt="О бренде Vita Brava Home"
        fill
        className="object-cover desktop:hidden"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-[rgba(17,10,0,0.25)]" />

      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col px-4 md:px-[39px] desktop:px-0">
        <div className="mt-8 desktop:mt-10">
          <Breadcrumbs items={breadcrumbs} variant="light" />
        </div>
        <div className="mt-auto mb-10 desktop:mb-16 max-w-[558px] text-[var(--color-light)]">
          <h1 className="text-[26px] md:text-[32px] desktop:text-[40px] font-medium leading-[1.1] whitespace-pre-line">
            {aboutHero.title}
          </h1>
        </div>
      </div>
    </section>
  );
}
