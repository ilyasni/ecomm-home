"use client";

import Image from "next/image";
import { aboutCreating as defaultAboutCreating } from "@/data/about";

interface AboutCreatingProps {
  data?: {
    title: string;
    blocks: { id: string; text: string; image: string; imagePosition: "left" | "right" }[];
  };
}

export function AboutCreating({ data }: AboutCreatingProps) {
  const aboutCreating = data ?? defaultAboutCreating;

  return (
    <section className="desktop:py-[80px] py-10">
      <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 md:px-[39px]">
        <h2 className="desktop:text-[40px] text-center text-[26px] leading-[1.1] font-medium md:text-[32px]">
          {aboutCreating.title}
        </h2>
      </div>

      <div className="desktop:mt-10 mt-8 flex flex-col">
        {aboutCreating.blocks.map((block) => (
          <div
            key={block.id}
            className={`flex flex-col ${
              block.imagePosition === "left" ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <div className="desktop:h-[688px] relative h-[343px] md:h-[500px] md:w-1/2">
              <Image src={block.image} alt="" fill className="object-cover" unoptimized />
            </div>
            <div className="desktop:p-16 flex min-h-[300px] items-center justify-center bg-[var(--color-selection)] p-8 md:min-h-0 md:w-1/2 md:p-10">
              <p className="desktop:text-[26px] max-w-[504px] text-center text-lg leading-[1.3] font-medium md:text-xl">
                {block.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
