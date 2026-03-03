"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/design-system/components";
import { Carousel } from "@/components/ui/Carousel";
import { news as defaultNews } from "@/data/home";

interface NewsItemData {
  id: string | number;
  label?: string;
  date: string;
  title: string;
  text?: string;
  image: string;
}

interface NewsProps {
  items?: NewsItemData[];
}

export function News({ items }: NewsProps = {}) {
  const news = items?.length ? items : defaultNews;
  const slides = news.map((item) => (
    <article key={item.id} className="desktop:w-[344px] w-[260px]">
      <div className="desktop:h-[344px] relative h-[260px] w-full">
        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Badge label={item.label ?? "Новость"} size="mobile" />
          <span className="text-[var(--color-gray)]">{item.date}</span>
        </div>
        <h4 className="desktop:text-lg text-base font-medium">{item.title}</h4>
        <p className="text-sm text-[var(--color-dark)]">{item.text}</p>
      </div>
    </article>
  ));

  return (
    <section className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
      <div className="flex items-center justify-between">
        <h2 className="desktop:text-[32px] text-2xl leading-[1.1] font-medium">Новости</h2>
        <Link className="text-sm leading-[1.3] text-[var(--color-brand)] underline" href="/news">
          Все статьи
        </Link>
      </div>
      <div className="mt-8">
        <Carousel
          slides={slides}
          slidesPerView={1.1}
          spaceBetween={16}
          showPagination
          paginationClassName="news-pagination"
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 12 },
            768: { slidesPerView: 2.2, spaceBetween: 8 },
            1400: { slidesPerView: 4, spaceBetween: 8 },
          }}
        />
        <div className="news-pagination desktop:hidden mt-6 flex justify-center gap-2" />
      </div>
    </section>
  );
}
