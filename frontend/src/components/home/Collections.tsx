"use client";

import Image from "next/image";
import { Badge, SliderButtons, Button } from "@/design-system/components";
import { Icon } from "@/design-system/icons";
import { Carousel } from "@/components/ui/Carousel";
import { SectionAdvantages } from "@/components/shared/SectionAdvantages";
import {
  advantageImages as defaultAdvantageImages,
  advantages as defaultAdvantages,
  budgetCollections as defaultBudgetCollections,
  hits as defaultHits,
} from "@/data/home";

interface FeaturedProductData {
  title: string;
  description?: string;
  price: string;
  image: string;
  badge?: string;
}

interface CollectionsProps {
  hits?: Array<{
    id: string | number;
    title: string;
    description?: string;
    price: string;
    oldPrice?: string;
    image: string;
    badge?: string;
  }>;
  featuredProduct?: FeaturedProductData;
  budgetCollections?: Array<{
    id: string | number;
    title: string;
    price: string;
    image: string;
  }>;
  advantages?: Array<{ id: string | number; title: string }>;
  advantageImages?: string[];
}

export function Collections({
  hits: propsHits,
  featuredProduct,
  budgetCollections: propsBudget,
  advantages: propsAdvantages,
  advantageImages: propsAdvImages,
}: CollectionsProps = {}) {
  const hits = propsHits?.length ? propsHits : defaultHits;
  const budgetCollections = propsBudget?.length ? propsBudget : defaultBudgetCollections;
  const advantages = propsAdvantages?.length ? propsAdvantages : [...defaultAdvantages];
  const advantageImages = propsAdvImages?.length ? propsAdvImages : defaultAdvantageImages;
  const hitSlides = hits.map((item) => (
    <div key={item.id} className="desktop:w-[461px] w-[260px]">
      <div className="desktop:h-[461px] relative h-[260px] w-full">
        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
        {item.badge ? (
          <div className="absolute top-4 left-4">
            <Badge label={item.badge} tone={item.badge.includes("%") ? "sale" : "exclusive"} />
          </div>
        ) : null}
        <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brown)]">
          <Icon name="favorite" size={20} />
        </div>
        <div className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-light)]">
          <Icon name="bagCard" size={20} />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <h3 className="desktop:text-lg text-base font-medium">{item.title}</h3>
        <p className="text-sm text-[var(--color-dark)]">{item.description}</p>
        <div className="flex items-center gap-3">
          <span className="desktop:text-base text-sm font-medium">{item.price}</span>
          {item.oldPrice ? (
            <span className="text-sm text-[var(--color-brown)] line-through">{item.oldPrice}</span>
          ) : null}
          <Icon name="rating" size={76} height={16} className="ml-auto" alt="Рейтинг" />
        </div>
      </div>
    </div>
  ));

  return (
    <section>
      <div className="desktop:h-[700px] relative h-[420px] overflow-hidden md:h-[400px]">
        <Image
          src={hits[0]?.image || "/assets/figma/placeholder.svg"}
          alt="Новые коллекции"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-[rgba(17,10,0,0.15)]" />
        <div className="desktop:px-0 relative mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 md:px-[39px]">
          <div className="space-y-6 text-[var(--color-light)]">
            <h2 className="desktop:text-[40px] text-3xl leading-[1.1] font-medium">
              Постельное белье
              <br />
              премиум качества
            </h2>
            <div className="flex items-center gap-4">
              <span>Смотреть коллекцию</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-brand)]">
                <Icon name="arrowRight" size={20} />
              </div>
            </div>
          </div>
          {featuredProduct && (
            <div className="desktop:block hidden rounded bg-[var(--color-selection)] p-3">
              <div className="relative h-[344px] w-[344px]">
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {featuredProduct.badge && (
                  <div className="absolute top-4 left-4 bg-[var(--color-gold)] px-2 py-1 text-sm text-[var(--color-light)]">
                    {featuredProduct.badge}
                  </div>
                )}
                <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brown)]">
                  <Icon name="favorite" size={20} />
                </div>
                <div className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-light)]">
                  <Icon name="bagCard" size={20} />
                </div>
              </div>
              <div className="mt-3 space-y-1 text-[var(--color-foreground)]">
                <p className="text-lg font-medium">{featuredProduct.title}</p>
                <p className="text-sm text-[var(--color-dark)]">{featuredProduct.description}</p>
                <p className="text-base font-medium">{featuredProduct.price}</p>
              </div>
            </div>
          )}
        </div>
        <div className="desktop:flex absolute bottom-8 left-1/2 hidden -translate-x-1/2">
          <div className="flex items-center gap-2">
            <span className="h-[3px] w-6 bg-[var(--color-light)]" />
            <span className="h-[2px] w-6 bg-[var(--color-selection)]" />
            <span className="h-[2px] w-6 bg-[var(--color-selection)]" />
            <span className="h-[2px] w-6 bg-[var(--color-selection)]" />
            <span className="h-[2px] w-6 bg-[var(--color-selection)]" />
          </div>
        </div>
      </div>

      <div className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
        <div className="desktop:flex-row desktop:items-center desktop:justify-between flex flex-col gap-6">
          <div className="desktop:text-2xl flex items-center gap-6 text-xl font-medium">
            <span>Хиты продаж</span>
            <span className="text-[var(--color-gray)]">Новинки</span>
            <span className="text-[var(--color-gray)]">Акции</span>
          </div>
          <SliderButtons className="relative" prevClassName="hits-prev" nextClassName="hits-next" />
        </div>
        <div className="relative mt-8">
          <Carousel
            slides={hitSlides}
            slidesPerView={1.2}
            spaceBetween={16}
            showNavigation
            prevButtonClassName="hits-prev"
            nextButtonClassName="hits-next"
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 12 },
              768: { slidesPerView: 2.2, spaceBetween: 8 },
              1400: { slidesPerView: 3, spaceBetween: 8 },
            }}
          />
        </div>
      </div>

      <div className="desktop:py-[80px] bg-[var(--color-selection)] py-10">
        <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 md:px-[39px]">
          <h2 className="desktop:text-[40px] text-center text-3xl leading-[1.1] font-medium">
            Коллекции под любой бюджет
          </h2>
          <div className="desktop:grid-cols-3 mt-10 grid grid-cols-1 gap-2 md:grid-cols-2">
            {budgetCollections.map((item) => (
              <div
                key={item.id}
                className="desktop:h-[700px] relative h-[460px] overflow-hidden md:h-[481px]"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-[var(--overlay-dark)]" />
                <div className="absolute bottom-10 left-1/2 w-[260px] -translate-x-1/2 text-center text-[var(--color-light)]">
                  <p className="desktop:text-[32px] text-2xl leading-[1.1] font-medium">
                    {item.title}
                  </p>
                  <p className="desktop:text-lg text-base leading-[1.3]">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="desktop:h-[660px] relative h-[420px] overflow-hidden md:h-[400px]">
        <Image
          src={advantageImages[0] || "/assets/figma/placeholder.svg"}
          alt="Специальные предложения"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="desktop:flex-row desktop:items-center desktop:justify-between desktop:px-0 relative mx-auto flex h-full max-w-[1400px] flex-col justify-center gap-8 px-4 md:px-[39px]">
          <div className="space-y-6 text-[var(--color-foreground)]">
            <h2 className="desktop:text-[40px] text-3xl leading-[1.1] font-medium">
              1+1 на любимые товары
            </h2>
            <Button variant="primary" type="button">
              Перейти в каталог
            </Button>
          </div>
          <div className="space-y-4">
            <p className="desktop:text-[24px] text-2xl leading-[1.3] font-medium">
              Специальные предложения
            </p>
            <SliderButtons
              className="relative"
              prevClassName="offers-prev"
              nextClassName="offers-next"
            />
          </div>
        </div>
      </div>

      <SectionAdvantages
        advantages={advantages.map((item) => ({
          id: String(item.id),
          title: item.title,
        }))}
        images={advantageImages}
        className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]"
      />
    </section>
  );
}
