"use client";

import Image from "next/image";
import { Icon } from "@/design-system/icons";

type Advantage = {
  id: string;
  title: string;
};

type SectionAdvantagesProps = {
  advantages: Advantage[];
  images?: string[];
  className?: string;
};

function AdvantageImage({ src }: { src?: string }) {
  if (!src) return <div className="h-full w-full bg-[var(--color-gold)]/30" />;
  return <Image src={src} alt="" fill className="object-cover" unoptimized />;
}

export function SectionAdvantages({ advantages, images = [], className }: SectionAdvantagesProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-2">
        <div className="desktop:grid-cols-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="desktop:h-[461px] flex h-[300px] flex-col items-center justify-center bg-[var(--color-gold)] px-10 text-center md:h-[343px]">
            <div className="flex items-center gap-0">
              <Icon name="diamond" size={30} />
              <Icon name="diamondAlt" size={30} />
              <Icon name="diamond" size={30} />
            </div>
            <p className="desktop:text-[24px] mt-4 max-w-[391px] text-xl leading-[1.1] font-medium text-[var(--color-foreground)]">
              {advantages[0]?.title}
            </p>
          </div>
          <div className="desktop:h-[461px] relative h-[300px] md:h-[343px]">
            <AdvantageImage src={images[0]} />
          </div>
          <div className="desktop:h-[461px] flex h-[300px] flex-col items-center justify-center bg-[var(--color-gold)] px-10 text-center md:h-[343px]">
            <div className="flex items-center gap-0">
              <Icon name="diamond" size={30} />
              <Icon name="diamondAlt" size={30} />
              <Icon name="diamond" size={30} />
            </div>
            <p className="desktop:text-[24px] mt-4 max-w-[391px] text-xl leading-[1.1] font-medium text-[var(--color-foreground)]">
              {advantages[1]?.title}
            </p>
          </div>
        </div>
        <div className="desktop:grid-cols-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="desktop:h-[461px] relative h-[300px] md:h-[343px]">
            <AdvantageImage src={images[1]} />
          </div>
          <div className="desktop:h-[461px] flex h-[300px] flex-col items-center justify-center bg-[var(--color-gold)] px-10 text-center md:h-[343px]">
            <div className="flex items-center gap-0">
              <Icon name="diamond" size={30} />
              <Icon name="diamondAlt" size={30} />
              <Icon name="diamond" size={30} />
            </div>
            <p className="desktop:text-[24px] mt-4 max-w-[391px] text-xl leading-[1.1] font-medium text-[var(--color-foreground)]">
              {advantages[2]?.title ?? advantages[0]?.title}
            </p>
          </div>
          <div className="desktop:h-[461px] relative h-[300px] md:h-[343px]">
            <AdvantageImage src={images[2]} />
          </div>
        </div>
      </div>
    </div>
  );
}
