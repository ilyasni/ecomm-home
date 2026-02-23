"use client";

import Image from "next/image";
import { aboutProduction } from "@/data/about";

export function AboutProduction() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 py-10 desktop:py-[80px]">
      <h2 className="text-center text-[26px] md:text-[32px] desktop:text-[40px] font-medium leading-[1.1]">
        {aboutProduction.title}
      </h2>
      <div className="mt-8 desktop:mt-10 grid grid-cols-1 md:grid-cols-2 desktop:grid-cols-4 gap-6 desktop:gap-4">
        {aboutProduction.steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center text-center">
            <div className="relative h-[60px] w-[60px]">
              <Image
                src={step.icon}
                alt={step.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-[var(--color-gray)]">
              <span>{String(idx + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-3 text-base font-medium leading-[1.1] desktop:text-lg">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-dark)] leading-[1.3] max-w-[300px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
