"use client";

import Image from "next/image";
import { aboutCreating } from "@/data/about";

export function AboutCreating() {
  return (
    <section className="py-10 desktop:py-[80px]">
      <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0">
        <h2 className="text-center text-[26px] md:text-[32px] desktop:text-[40px] font-medium leading-[1.1]">
          {aboutCreating.title}
        </h2>
      </div>

      <div className="mt-8 desktop:mt-10 flex flex-col">
        {aboutCreating.blocks.map((block) => (
          <div
            key={block.id}
            className={`flex flex-col ${
              block.imagePosition === "left"
                ? "md:flex-row"
                : "md:flex-row-reverse"
            }`}
          >
            <div className="relative h-[343px] md:h-[500px] desktop:h-[688px] md:w-1/2">
              <Image
                src={block.image}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex items-center justify-center bg-[var(--color-selection)] p-8 md:p-10 desktop:p-16 md:w-1/2 min-h-[300px] md:min-h-0">
              <p className="text-lg md:text-xl desktop:text-[26px] font-medium leading-[1.3] text-center max-w-[504px]">
                {block.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
