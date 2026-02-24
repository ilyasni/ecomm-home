"use client";

import Image from "next/image";
import { ArrowLink } from "@/design-system/components";
import { Carousel } from "@/components/ui/Carousel";
import { heroSlides as defaultSlides } from "@/data/home";

interface HeroSlideData {
  id?: number;
  title: string;
  subtitle?: string;
  action?: string;
  desktopImage?: string;
  mobileImage?: string;
}

interface HeroProps {
  slides?: HeroSlideData[];
}

export function Hero({ slides: propSlides }: HeroProps = {}) {
  const heroSlides = propSlides?.length ? propSlides : defaultSlides;
  const slides = heroSlides.map((slide, index) => (
    <div
      className="desktop:h-[850px] relative h-[420px] w-full overflow-hidden md:h-[503px]"
      key={slide.id ?? index}
    >
      <Image
        src={slide.desktopImage || "/assets/figma/placeholder.svg"}
        alt={slide.title}
        fill
        className="desktop:block hidden object-cover"
        priority
        unoptimized
      />
      <Image
        src={slide.mobileImage || "/assets/figma/placeholder.svg"}
        alt={slide.title}
        fill
        className="desktop:hidden object-cover"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-[rgba(17,10,0,0.25)]" />
      <div className="desktop:px-0 desktop:pb-[134px] relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-8 md:px-[39px]">
        <div className="max-w-[558px] text-[var(--color-light)]">
          <h1 className="desktop:text-[40px] text-[26px] leading-[1.1] font-medium">
            {slide.title}
          </h1>
          <div className="desktop:mt-8 mt-4 flex flex-col gap-6">
            <p className="desktop:text-[18px] desktop:leading-[1.5] text-sm leading-[1.3] uppercase">
              {slide.subtitle}
            </p>
            <ArrowLink label={slide.action ?? ""} size="lg" />
          </div>
        </div>
      </div>
      <div className="hero-pagination desktop:bottom-8 absolute bottom-6 left-1/2 -translate-x-1/2" />
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
