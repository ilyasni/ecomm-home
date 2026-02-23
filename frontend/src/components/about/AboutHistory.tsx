"use client";

import Image from "next/image";
import { aboutHistory, whatMakesUsDifferent } from "@/data/about";

export function AboutHistory() {
  return (
    <section className="mx-auto max-w-[1044px] px-4 md:px-[39px] desktop:px-0 py-10 desktop:py-[80px]">
      <h2 className="text-center text-[26px] md:text-[32px] desktop:text-[40px] font-medium leading-[1.1]">
        {aboutHistory.title}
      </h2>
      <div className="mt-8 desktop:mt-10 flex flex-col gap-4">
        {aboutHistory.paragraphs.map((p, idx) => (
          <p
            key={idx}
            className="text-sm leading-[1.5] text-[var(--color-dark)] desktop:text-base"
          >
            {p}
          </p>
        ))}
      </div>

      <div className="mt-10 desktop:mt-12">
        <h3 className="text-center text-[20px] md:text-[24px] desktop:text-[28px] font-medium leading-[1.1]">
          {whatMakesUsDifferent.title}
        </h3>
        <div className="mt-6 desktop:mt-8 grid grid-cols-1 md:grid-cols-3 gap-2">
          {whatMakesUsDifferent.items.map((item) => (
            <div key={item.id} className="relative h-[343px] overflow-hidden group">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-[var(--color-light)]">
                <p className="text-lg font-medium leading-[1.1]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-[1.3] opacity-90">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
