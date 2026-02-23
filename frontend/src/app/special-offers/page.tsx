"use client";

import Image from "next/image";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { Badge, SliderButtons } from "@/design-system/components";
import { Carousel } from "@/components/ui/Carousel";
import { OffersGrid, BonusSection } from "@/components/special-offers";
import { newsSlider } from "@/data/special-offers";

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Специальные предложения" },
];

export default function SpecialOffersPage() {
  const prevClass = "offers-news-prev";
  const nextClass = "offers-news-next";

  const newsSlides = newsSlider.map((item) => (
    <div key={item.id} className="w-[290px] desktop:w-[340px]">
      <div className="relative h-[290px] w-full desktop:h-[340px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-3">
          <Badge label={item.label} tone="exclusive" />
          <span className="text-sm text-[var(--color-gray)]">{item.date}</span>
        </div>
        <h3 className="text-base font-medium leading-[1.3]">{item.title}</h3>
        <p className="text-sm text-[var(--color-dark)] leading-[1.3]">
          {item.text}
        </p>
      </div>
    </div>
  ));

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-6 md:mt-8">
          <h1 className="text-center text-[26px] md:text-[32px] desktop:text-[40px] font-medium leading-[1.1]">
            Специальные предложения
            <br />
            от Vita Brava Home
          </h1>
        </div>

        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-8 desktop:mt-10">
          <OffersGrid />
        </div>

        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-12 desktop:mt-16">
          <BonusSection />
        </div>

        <section className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-12 desktop:mt-16 mb-16 desktop:mb-20">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-[22px] md:text-[26px] desktop:text-[28px] font-medium leading-[1.1]">
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
      </main>
      <Footer />
    </div>
  );
}
