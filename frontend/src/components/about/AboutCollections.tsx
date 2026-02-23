"use client";

import Image from "next/image";
import { aboutCollections } from "@/data/about";

export function AboutCollections() {
  return (
    <section className="py-10 desktop:py-[80px]">
      <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0">
        <div className="text-center">
          <h2 className="text-[26px] md:text-[32px] desktop:text-[40px] font-medium leading-[1.1]">
            {aboutCollections.title}
          </h2>
          <p className="mt-4 text-sm text-[var(--color-dark)] leading-[1.3] desktop:text-base">
            {aboutCollections.subtitle}
          </p>
        </div>
        <div className="mt-8 desktop:mt-10 grid grid-cols-1 md:grid-cols-3 gap-2">
          {aboutCollections.items.map((item) => (
            <a
              key={item.id}
              href="#"
              className="group relative h-[460px] md:h-[500px] desktop:h-[700px] overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)]" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-[var(--color-light)]">
                <p className="text-xl md:text-2xl desktop:text-[28px] font-medium leading-[1.1] whitespace-nowrap">
                  {item.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
