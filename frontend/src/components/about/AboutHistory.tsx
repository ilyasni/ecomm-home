"use client";

import Image from "next/image";
import {
  aboutHistory as defaultAboutHistory,
  whatMakesUsDifferent as defaultWhatMakesUsDifferent,
} from "@/data/about";

interface AboutHistoryProps {
  history?: {
    title: string;
    paragraphs: string[];
  };
  differenceData?: {
    title: string;
    items: { id: string; title: string; subtitle: string; image: string }[];
  };
}

export function AboutHistory({ history, differenceData }: AboutHistoryProps) {
  const aboutHistory = history ?? defaultAboutHistory;
  const whatMakesUsDifferent = differenceData ?? defaultWhatMakesUsDifferent;

  return (
    <section className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1044px] px-4 py-10 md:px-[39px]">
      <h2 className="desktop:text-[40px] text-center text-[26px] leading-[1.1] font-medium md:text-[32px]">
        {aboutHistory.title}
      </h2>
      <div className="desktop:mt-10 mt-8 flex flex-col gap-4">
        {aboutHistory.paragraphs.map((p, idx) => (
          <p key={idx} className="desktop:text-base text-sm leading-[1.5] text-[var(--color-dark)]">
            {p}
          </p>
        ))}
      </div>

      <div className="desktop:mt-12 mt-10">
        <h3 className="desktop:text-[28px] text-center text-[20px] leading-[1.1] font-medium md:text-[24px]">
          {whatMakesUsDifferent.title}
        </h3>
        <div className="desktop:mt-8 mt-6 grid grid-cols-1 gap-2 md:grid-cols-3">
          {whatMakesUsDifferent.items.map((item) => (
            <div key={item.id} className="group relative h-[343px] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute right-6 bottom-6 left-6 text-[var(--color-light)]">
                <p className="text-lg leading-[1.1] font-medium">{item.title}</p>
                <p className="mt-1 text-sm leading-[1.3] opacity-90">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
