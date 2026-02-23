"use client";

import { Carousel } from "@/components/ui/Carousel";
import { NewsCardSmall } from "@/components/news/NewsCardSmall";
import { SliderButtons } from "@/design-system/components";
import { newsList } from "@/data/news";

type ReadAlsoSectionProps = {
  currentSlug?: string;
  className?: string;
};

export function ReadAlsoSection({
  currentSlug,
  className,
}: ReadAlsoSectionProps) {
  const items = newsList
    .filter((n) => n.slug !== currentSlug)
    .slice(0, 8);

  const prevClass = "read-also-prev";
  const nextClass = "read-also-next";

  if (items.length === 0) return null;

  return (
    <section className={className || ""}>
      <div className="flex items-center justify-between mb-6 desktop:mb-10">
        <h2 className="text-[20px] md:text-[28px] desktop:text-[32px] font-medium leading-[1.1]">
          Читайте также
        </h2>
        <SliderButtons
          prevClassName={prevClass}
          nextClassName={nextClass}
          className="hidden md:flex"
        />
      </div>
      <Carousel
        slides={items.map((item) => (
          <NewsCardSmall key={item.id} item={item} />
        ))}
        slidesPerView={1}
        spaceBetween={16}
        showNavigation
        prevButtonClassName={prevClass}
        nextButtonClassName={nextClass}
        breakpoints={{
          768: { slidesPerView: 2, spaceBetween: 16 },
          1400: { slidesPerView: 4, spaceBetween: 16 },
        }}
      />
    </section>
  );
}
