"use client";

import Image from "next/image";
import { aboutProduction as defaultAboutProduction } from "@/data/about";

interface AboutProductionProps {
  data?: {
    title: string;
    steps: { id: string; icon: string; title: string; description: string }[];
  };
}

export function AboutProduction({ data }: AboutProductionProps) {
  const aboutProduction = data ?? defaultAboutProduction;

  return (
    <section className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
      <h2 className="desktop:text-[40px] text-center text-[26px] leading-[1.1] font-medium md:text-[32px]">
        {aboutProduction.title}
      </h2>
      <div className="desktop:mt-10 desktop:grid-cols-4 desktop:gap-4 mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {aboutProduction.steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center text-center">
            <div className="relative h-[60px] w-[60px]">
              <Image src={step.icon} alt={step.title} fill className="object-contain" unoptimized />
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-[var(--color-gray)]">
              <span>{String(idx + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="desktop:text-lg mt-3 text-base leading-[1.1] font-medium">
              {step.title}
            </h3>
            <p className="mt-2 max-w-[300px] text-sm leading-[1.3] text-[var(--color-dark)]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
