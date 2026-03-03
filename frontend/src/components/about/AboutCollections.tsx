"use client";

import Image from "next/image";
import { aboutCollections as defaultAboutCollections } from "@/data/about";

interface AboutCollectionsProps {
  data?: {
    title: string;
    subtitle: string;
    items: { id: string; title: string; image: string }[];
  };
}

export function AboutCollections({ data }: AboutCollectionsProps) {
  const aboutCollections = data ?? defaultAboutCollections;

  return (
    <section className="desktop:py-[80px] py-10">
      <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 md:px-[39px]">
        <div className="text-center">
          <h2 className="desktop:text-[40px] text-[26px] leading-[1.1] font-medium md:text-[32px]">
            {aboutCollections.title}
          </h2>
          <p className="desktop:text-base mt-4 text-sm leading-[1.3] text-[var(--color-dark)]">
            {aboutCollections.subtitle}
          </p>
        </div>
        <div className="desktop:mt-10 mt-8 grid grid-cols-1 gap-2 md:grid-cols-3">
          {aboutCollections.items.map((item) => (
            <a
              key={item.id}
              href="#"
              className="group desktop:h-[700px] relative h-[460px] overflow-hidden md:h-[500px]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-[var(--overlay-dark)]" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-[var(--color-light)]">
                <p className="desktop:text-[28px] text-xl leading-[1.1] font-medium whitespace-nowrap md:text-2xl">
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
