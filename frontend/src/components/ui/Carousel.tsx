"use client";

import type { ReactNode } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type CarouselProps = {
  slides: ReactNode[];
  className?: string;
  slideClassName?: string;
  spaceBetween?: number;
  slidesPerView?: number | "auto";
  loop?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  paginationClassName?: string;
  prevButtonClassName?: string;
  nextButtonClassName?: string;
  renderNavigationButtons?: boolean;
  breakpoints?: Record<number, { slidesPerView?: number | "auto"; spaceBetween?: number }>;
};

export function Carousel({
  slides,
  className,
  slideClassName,
  spaceBetween = 16,
  slidesPerView = 1,
  loop = false,
  showPagination = false,
  showNavigation = false,
  paginationClassName,
  prevButtonClassName,
  nextButtonClassName,
  renderNavigationButtons = false,
  breakpoints,
}: CarouselProps) {
  return (
    <div className={className}>
      {showNavigation && renderNavigationButtons ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
          <button
            className={`pointer-events-auto ${prevButtonClassName || ""}`}
            type="button"
            aria-label="Предыдущий слайд"
          />
          <button
            className={`pointer-events-auto ${nextButtonClassName || ""}`}
            type="button"
            aria-label="Следующий слайд"
          />
        </div>
      ) : null}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={
          showNavigation && prevButtonClassName && nextButtonClassName
            ? {
                prevEl: `.${prevButtonClassName}`,
                nextEl: `.${nextButtonClassName}`,
              }
            : undefined
        }
        pagination={
          showPagination
            ? {
                el: paginationClassName ? `.${paginationClassName}` : undefined,
                clickable: true,
              }
            : undefined
        }
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        loop={loop}
        breakpoints={breakpoints}
      >
        {slides.map((slide, index) => (
          <SwiperSlide className={slideClassName} key={index}>
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
