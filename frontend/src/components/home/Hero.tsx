"use client";

import Image from "next/image";
import { ArrowLink } from "@/design-system/components";
import { Carousel } from "@/components/ui/Carousel";
import { heroSlides } from "@/data/home";

export function Hero() {
  const slides = heroSlides.map((slide) => (
    <div
      className="relative h-[420px] w-full overflow-hidden md:h-[503px] desktop:h-[850px]"
      key={slide.id}
    >
      <Image
        src={slide.desktopImage}
        alt={slide.title}
        fill
        className="hidden object-cover desktop:block"
        priority
        unoptimized
      />
      <Image
        src={slide.mobileImage}
        alt={slide.title}
        fill
        className="object-cover desktop:hidden"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-[rgba(17,10,0,0.25)]" />
      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-8 md:px-[39px] desktop:px-0 desktop:pb-[134px]">
        <div className="max-w-[558px] text-[var(--color-light)]">
          <h1 className="text-[26px] font-medium leading-[1.1] desktop:text-[40px]">
            {slide.title}
          </h1>
          <div className="mt-4 flex flex-col gap-6 desktop:mt-8">
            <p className="text-sm leading-[1.3] uppercase desktop:text-[18px] desktop:leading-[1.5]">
              {slide.subtitle}
            </p>
            <ArrowLink label={slide.action} size="lg" />
          </div>
        </div>
      </div>
      <div className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 desktop:bottom-8" />
    </div>
  ));

  return (
    <section className="relative">
      <Carousel
        slides={slides}
        loop
        showPagination
        paginationClassName="hero-pagination"
        className="relative"
      />
    </section>
  );
}
