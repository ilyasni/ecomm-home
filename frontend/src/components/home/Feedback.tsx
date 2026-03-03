"use client";

import Image from "next/image";
import { SliderButtons } from "@/design-system/components";
import { Carousel } from "@/components/ui/Carousel";
import { feedbacks as defaultFeedbacks } from "@/data/home";

interface FeedbackData {
  id: string | number;
  name: string;
  city: string;
  text: string;
  avatar?: string;
}

interface FeedbackProps {
  items?: FeedbackData[];
}

export function Feedback({ items }: FeedbackProps = {}) {
  const feedbacks = items?.length ? items : defaultFeedbacks;
  const slides = feedbacks.map((item) => (
    <div
      key={item.id}
      className="desktop:p-8 h-full rounded-[5px] border border-[var(--color-gray-light)] p-6"
    >
      <Image
        src="/assets/figma/feedback/stars.svg"
        alt="Рейтинг"
        width={116}
        height={18}
        unoptimized
      />
      <div className="mt-6 flex items-center gap-5">
        {item.avatar && (
          <Image
            src={item.avatar}
            alt={item.name}
            width={56}
            height={56}
            className="rounded-full"
            unoptimized
          />
        )}
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-[var(--color-dark)]">{item.city}</p>
        </div>
      </div>
      <p className="desktop:text-base mt-2 text-sm leading-[1.3] text-[var(--color-dark)]">
        {item.text}
      </p>
    </div>
  ));

  return (
    <section className="desktop:px-0 desktop:pb-[80px] mx-auto max-w-[1400px] px-4 pb-10 md:px-[39px]">
      <div className="desktop:flex-row desktop:items-center desktop:justify-between flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <h2 className="desktop:text-[40px] text-3xl leading-[1.1] font-medium">Отзывы</h2>
          <a className="text-base leading-[1.3] text-[var(--color-brand)] underline" href="#">
            Оставить отзыв
          </a>
        </div>
        <SliderButtons prevClassName="feedback-prev" nextClassName="feedback-next" />
      </div>
      <div className="mt-10">
        <Carousel
          slides={slides}
          slidesPerView={1.1}
          spaceBetween={8}
          showNavigation
          prevButtonClassName="feedback-prev"
          nextButtonClassName="feedback-next"
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 12 },
            768: { slidesPerView: 2.2, spaceBetween: 8 },
            1400: { slidesPerView: 3, spaceBetween: 8 },
          }}
        />
      </div>
    </section>
  );
}
