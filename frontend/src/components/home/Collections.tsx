"use client";

import Image from "next/image";
import { Badge, SliderButtons, Button } from "@/design-system/components";
import { Icon } from "@/design-system/icons";
import { Carousel } from "@/components/ui/Carousel";
import { SectionAdvantages } from "@/components/shared/SectionAdvantages";
import {
  advantageImages,
  advantages,
  budgetCollections,
  hits,
} from "@/data/home";

export function Collections() {
  const hitSlides = hits.map((item) => (
    <div key={item.id} className="w-[260px] desktop:w-[461px]">
      <div className="relative h-[260px] w-full desktop:h-[461px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          unoptimized
        />
        {item.badge ? (
          <div className="absolute left-4 top-4">
            <Badge
              label={item.badge}
              tone={item.badge.includes("%") ? "sale" : "exclusive"}
            />
          </div>
        ) : null}
        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brown)]">
          <Icon name="favorite" size={20} />
        </div>
        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-light)]">
          <Icon name="bag" size={20} />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <h3 className="text-base font-medium desktop:text-lg">{item.title}</h3>
        <p className="text-sm text-[var(--color-dark)]">{item.description}</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium desktop:text-base">{item.price}</span>
          {item.oldPrice ? (
            <span className="text-sm text-[var(--color-brown)] line-through">
              {item.oldPrice}
            </span>
          ) : null}
          <Icon name="rating" size={76} height={16} className="ml-auto" alt="Рейтинг" />
        </div>
      </div>
    </div>
  ));

  return (
    <section>
      <div className="relative h-[420px] overflow-hidden md:h-[400px] desktop:h-[700px]">
        <Image
          src="/assets/figma/collections/banner.jpg"
          alt="Новые коллекции"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-[rgba(17,10,0,0.15)]" />
        <div className="relative mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 md:px-[39px] desktop:px-0">
          <div className="space-y-6 text-[var(--color-light)]">
            <h2 className="text-3xl font-medium leading-[1.1] desktop:text-[40px]">
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
          <div className="hidden rounded bg-[var(--color-selection)] p-3 desktop:block">
            <div className="relative h-[344px] w-[344px]">
              <Image
                src="/assets/figma/collections/featured.jpg"
                alt="Подушка"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute left-4 top-4 bg-[var(--color-gold)] px-2 py-1 text-sm text-[var(--color-light)]">
                Эксклюзив
              </div>
              <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brown)]">
                <Icon name="favorite" size={20} />
              </div>
              <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-light)]">
                <Icon name="bag" size={20} />
              </div>
            </div>
            <div className="mt-3 space-y-1 text-[var(--color-foreground)]">
              <p className="text-lg font-medium">Подушка</p>
              <p className="text-sm text-[var(--color-dark)]">
                Белый утиный пух в хлопке-батисте
              </p>
              <p className="text-base font-medium">5 000 ₽</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 desktop:flex">
          <div className="flex items-center gap-2">
            <span className="h-[3px] w-6 bg-[var(--color-light)]" />
            <span className="h-[2px] w-6 bg-[var(--color-selection)]" />
            <span className="h-[2px] w-6 bg-[var(--color-selection)]" />
            <span className="h-[2px] w-6 bg-[var(--color-selection)]" />
            <span className="h-[2px] w-6 bg-[var(--color-selection)]" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-[39px] desktop:px-0 desktop:py-[80px]">
        <div className="flex flex-col gap-6 desktop:flex-row desktop:items-center desktop:justify-between">
          <div className="flex items-center gap-6 text-xl font-medium desktop:text-2xl">
            <span>Хиты продаж</span>
            <span className="text-[var(--color-gray)]">Новинки</span>
            <span className="text-[var(--color-gray)]">Акции</span>
          </div>
          <SliderButtons
            className="relative"
            prevClassName="hits-prev"
            nextClassName="hits-next"
          />
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
              768: { slidesPerView: 2.2, spaceBetween: 8 },
              1400: { slidesPerView: 3, spaceBetween: 8 },
            }}
          />
        </div>
      </div>

      <div className="bg-[var(--color-selection)] py-10 desktop:py-[80px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0">
          <h2 className="text-center text-3xl font-medium leading-[1.1] desktop:text-[40px]">
            Коллекции под любой бюджет
          </h2>
          <div className="mt-10 grid gap-2 md:grid-cols-3 desktop:grid-cols-3">
            {budgetCollections.map((item) => (
              <div key={item.id} className="relative h-[460px] md:h-[481px] desktop:h-[700px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)]" />
                <div className="absolute bottom-10 left-1/2 w-[260px] -translate-x-1/2 text-center text-[var(--color-light)]">
                  <p className="text-2xl font-medium leading-[1.1] desktop:text-[32px]">
                    {item.title}
                  </p>
                  <p className="text-base leading-[1.3] desktop:text-lg">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative h-[420px] overflow-hidden md:h-[400px] desktop:h-[660px]">
        <Image
          src="/assets/figma/collections/special.jpg"
          alt="Специальные предложения"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center gap-8 px-4 md:px-[39px] desktop:flex-row desktop:items-center desktop:justify-between desktop:px-0">
          <div className="space-y-6 text-[var(--color-foreground)]">
            <h2 className="text-3xl font-medium leading-[1.1] desktop:text-[40px]">
              1+1 на любимые товары
            </h2>
            <Button variant="primary" type="button">
              Перейти в каталог
            </Button>
          </div>
          <div className="space-y-4">
            <p className="text-2xl font-medium leading-[1.3] desktop:text-[24px]">
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
        advantages={[...advantages]}
        images={advantageImages}
        className="mx-auto max-w-[1400px] px-4 py-10 md:px-[39px] desktop:px-0 desktop:py-[80px]"
      />
    </section>
  );
}
