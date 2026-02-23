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
    <div key={i} className="relative w-full h-[420px] md:h-[500px] desktop:h-[700px]">
      <Image
        src={src}
        alt={`${title} — слайд ${i + 1}`}
        fill
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-[rgba(17,10,0,0.25)]" />
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

      <div className="absolute inset-0 flex items-end pointer-events-none">
        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-[39px] desktop:px-0 pb-10 md:pb-12 desktop:pb-16">
          <div className="text-[var(--color-light)] space-y-4 desktop:space-y-6">
            <h1 className="text-[30px] md:text-[36px] desktop:text-[40px] font-medium leading-[1.1] italic">
              {title}
            </h1>
            <p className="text-sm desktop:text-base leading-[1.3] max-w-[400px] whitespace-pre-line">
              {subtitle}
            </p>
            <div className="flex items-center gap-4 pointer-events-auto">
              <span className="text-sm desktop:text-base">{buttonLabel}</span>
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
