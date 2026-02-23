"use client";

import Image from "next/image";
import { categories } from "@/data/home";

export function Categories() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-4 py-10 md:px-[39px] desktop:px-0 desktop:py-[80px]">
      <Image
        src="/assets/figma/categories/hand.png"
        alt=""
        width={400}
        height={500}
        className="pointer-events-none absolute -right-4 bottom-0 z-10 hidden w-[280px] desktop:block desktop:w-[400px]"
        unoptimized
        aria-hidden="true"
      />
      <div className="grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-1 desktop:gap-2">
        {categories.map((item, index) => {
          const isWide = item.isWide && index === 0;
          return (
            <article
              className={`relative overflow-hidden ${isWide ? "col-span-2" : ""} h-[217px] md:h-[232px] desktop:h-[440px]`}
              key={item.id}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.2)]" />
              <div className="absolute bottom-4 left-4 flex items-end gap-2 text-[var(--color-light)]">
                <span className="text-lg font-medium leading-[1.1] desktop:text-2xl">
                  {item.title}
                </span>
                <span className="pb-4 text-xs text-[#D9D5D0] desktop:text-sm leading-[1.3]">
                  ({item.count})
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
