"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { NewsCardLarge } from "@/components/news/NewsCardLarge";
import { NewsCardMedium } from "@/components/news/NewsCardMedium";
import { NewsCardSmall } from "@/components/news/NewsCardSmall";
import { NewsTabs } from "@/components/news/NewsTabs";
import { Button, SliderButtons } from "@/design-system/components";
import { Carousel } from "@/components/ui/Carousel";
import { ProductCard } from "@/components/catalog/ProductCard";
import { newsList, type NewsCategory } from "@/data/news";
import { recentlyViewed } from "@/data/account";

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Новости" },
];

const INITIAL_COUNT = 10;

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>("все");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    if (activeCategory === "все") return newsList;
    return newsList.filter((n) => n.category === activeCategory);
  }, [activeCategory]);

  const items = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  const featured = items[0];
  const smallCards = items.slice(1, 4);
  const mediumCards = items.slice(4, 7);
  const mixedMedium = items[7];
  const mixedLarge = items[8];
  const extraCards = items.slice(9);

  const prevClass = "news-watched-prev";
  const nextClass = "news-watched-next";

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px]">
        {/* Breadcrumbs */}
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Заголовок + табы */}
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-6 md:mt-8">
          <h1 className="text-center text-[28px] md:text-[36px] font-medium leading-[1.1]">
            Новости
          </h1>
          <div className="mt-6 md:mt-8">
            <NewsTabs active={activeCategory} onChange={setActiveCategory} />
          </div>
        </div>

        {/* Сетка новостей */}
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-8 md:mt-10">
          {/* Секция 1: Featured — large + 3 small */}
          {featured && (
            <div className="flex flex-col md:flex-row md:gap-4 desktop:gap-2">
              <div className="md:flex-[2_1_0%] desktop:flex-[930_0_0%]">
                <NewsCardLarge item={featured} />
              </div>
              {smallCards.length > 0 && (
                <div className="mt-6 md:mt-0 md:flex-[1_1_0%] desktop:flex-[462_0_0%] flex flex-col gap-4 desktop:gap-[8px]">
                  {smallCards.map((item) => (
                    <NewsCardSmall key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Секция 2: Medium — 3 карточки в ряд */}
          {mediumCards.length > 0 && (
            <div className="mt-10 md:mt-12">
              {/* Desktop: 3 колонки, Tablet: 2, Mobile: 2 по 50% */}
              <div className="grid grid-cols-2 desktop:grid-cols-3 gap-2">
                {mediumCards.map((item) => (
                  <NewsCardMedium key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Секция 3: Mixed — 1 medium + 1 large */}
          {(mixedMedium || mixedLarge) && (
            <div className="mt-10 md:mt-12">
              <div className="flex flex-col md:flex-row md:gap-4 desktop:gap-2">
                {mixedMedium && (
                  <div className="md:flex-[1_1_0%] desktop:flex-[461_0_0%]">
                    <NewsCardMedium item={mixedMedium} />
                  </div>
                )}
                {mixedLarge && (
                  <div className="mt-6 md:mt-0 md:flex-[2_1_0%] desktop:flex-[930_0_0%]">
                    <NewsCardLarge item={mixedLarge} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Доп. карточки (если showAll) */}
          {extraCards.length > 0 && (
            <div className="mt-10 md:mt-12 grid grid-cols-2 desktop:grid-cols-3 gap-2">
              {extraCards.map((item) => (
                <NewsCardMedium key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Кнопка "Больше новостей" */}
          {!showAll && filtered.length > INITIAL_COUNT && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="secondary"
                className="w-full md:w-[200px]"
                onClick={() => setShowAll(true)}
              >
                Больше новостей
              </Button>
            </div>
          )}
        </div>

        {/* Секция "Ранее вы смотрели" */}
        {recentlyViewed.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-16 md:mt-20">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h2 className="text-[22px] md:text-[28px] desktop:text-[32px] font-medium leading-[1.1]">
                Ранее вы смотрели
              </h2>
              <SliderButtons
                prevClassName={prevClass}
                nextClassName={nextClass}
                className="hidden md:flex"
              />
            </div>
            <Carousel
              slides={recentlyViewed.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    image: product.image,
                    badge: product.badge,
                  }}
                  variant="medium"
                />
              ))}
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
        )}

        {/* Баннер-футер (нижний промо-блок) */}
        <div className="mt-16 md:mt-20" />
      </main>
      <Footer />
    </div>
  );
}
