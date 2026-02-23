"use client";

import Image from "next/image";
import { Badge } from "@/design-system/components";
import { Carousel } from "@/components/ui/Carousel";
import { news } from "@/data/home";

export function News() {
  const slides = news.map((item) => (
    <article key={item.id} className="w-[260px] desktop:w-[344px]">
      <div className="relative h-[260px] w-full desktop:h-[344px]">
        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Badge label={item.label} size="mobile" />
          <span className="text-[var(--color-gray)]">{item.date}</span>
        </div>
        <h4 className="text-base font-medium desktop:text-lg">{item.title}</h4>
        <p className="text-sm text-[var(--color-dark)]">{item.text}</p>
      </div>
    </article>
  ));

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 md:px-[39px] desktop:px-0 desktop:py-[80px]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium leading-[1.1] desktop:text-[32px]">Новости</h2>
        <a className="text-sm text-[var(--color-brand)] underline leading-[1.3]" href="#">
          Все статьи
        </a>
      </div>
      <div className="mt-8">
        <Carousel
          slides={slides}
          slidesPerView={1.1}
          spaceBetween={16}
          showPagination
          paginationClassName="news-pagination"
          breakpoints={{
            768: { slidesPerView: 2.2, spaceBetween: 8 },
            1400: { slidesPerView: 4, spaceBetween: 8 },
          }}
        />
        <div className="news-pagination mt-6 flex justify-center gap-2 desktop:hidden" />
      </div>
    </section>
  );
}
