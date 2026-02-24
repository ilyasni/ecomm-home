"use client";

import Image from "next/image";
import { Badge, SliderButtons } from "@/design-system/components";
import { Carousel } from "@/components/ui/Carousel";
import { newsSlider as defaultNewsSlider } from "@/data/special-offers";

type NewsItem = {
  id: string;
  label: string;
  date: string;
  title: string;
  text: string;
  image: string;
};

type NewsSliderProps = {
  data?: NewsItem[];
};

export function NewsSlider({ data }: NewsSliderProps) {
  const newsSlider = data ?? defaultNewsSlider;
  const prevClass = "offers-news-prev";
  const nextClass = "offers-news-next";

  const newsSlides = newsSlider.map((item) => (
    <div key={item.id} className="desktop:w-[340px] w-[290px]">
      <div className="desktop:h-[340px] relative h-[290px] w-full">
        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-3">
          <Badge label={item.label} tone="exclusive" />
          <span className="text-sm text-[var(--color-gray)]">{item.date}</span>
        </div>
        <h3 className="text-base leading-[1.3] font-medium">{item.title}</h3>
        <p className="text-sm leading-[1.3] text-[var(--color-dark)]">{item.text}</p>
      </div>
    </div>
  ));

  return (
    <section className="desktop:px-0 desktop:mt-16 desktop:mb-20 mx-auto mt-12 mb-16 max-w-[1400px] px-4 md:px-[39px]">
      <div className="mb-6 flex items-center justify-between md:mb-8">
        <h2 className="desktop:text-[28px] text-[22px] leading-[1.1] font-medium md:text-[26px]">
          Новости и статьи
        </h2>
        <SliderButtons
          prevClassName={prevClass}
          nextClassName={nextClass}
          className="hidden md:flex"
        />
      </div>
      <Carousel
        slides={newsSlides}
        slidesPerView={1.2}
        spaceBetween={8}
        showNavigation
        prevButtonClassName={prevClass}
        nextButtonClassName={nextClass}
        breakpoints={{
          768: { slidesPerView: 2.2, spaceBetween: 8 },
          1400: { slidesPerView: 4, spaceBetween: 8 },
        }}
      />
    </section>
  );
}
