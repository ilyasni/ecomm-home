"use client";

import Image from "next/image";
import { SliderDots } from "@/design-system/components";
import { Carousel } from "@/components/ui/Carousel";

type CollectionHeroProps = {
  title: string;
  subtitle: string;
  images: string[];
  buttonLabel?: string;
};

export function CollectionHero({
  title,
  subtitle,
  images,
  buttonLabel = "Все товары",
}: CollectionHeroProps) {
  const paginationClass = "collection-hero-dots";

  const slides = images.map((src, i) => (
    <div key={i} className="desktop:h-[700px] relative h-[420px] w-full md:h-[500px]">
      <Image
        src={src}
        alt={`${title} — слайд ${i + 1}`}
        fill
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-[var(--overlay-dark-light)]" />
    </div>
  ));

  return (
    <section className="relative">
      <Carousel
        slides={slides}
        slidesPerView={1}
        spaceBetween={0}
        loop
        showPagination
        paginationClassName={paginationClass}
      />

      <div className="pointer-events-none absolute inset-0 flex items-end">
        <div className="desktop:px-0 desktop:pb-16 mx-auto w-full max-w-[1400px] px-4 pb-10 md:px-[39px] md:pb-12">
          <div className="desktop:space-y-6 space-y-4 text-[var(--color-light)]">
            <h1 className="desktop:text-[40px] text-[30px] leading-[1.1] font-medium italic md:text-[36px]">
              {title}
            </h1>
            <p className="desktop:text-base max-w-[400px] text-sm leading-[1.3] whitespace-pre-line">
              {subtitle}
            </p>
            <div className="pointer-events-auto flex items-center gap-4">
              <span className="desktop:text-base text-sm">{buttonLabel}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-light)]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <SliderDots className={paginationClass} />
      </div>
    </section>
  );
}
