"use client";

import Image from "next/image";
import { Icon } from "@/design-system/icons";

type Advantage = {
  id: string;
  title: string;
};

type SectionAdvantagesProps = {
  advantages: Advantage[];
  images: string[];
  className?: string;
};

export function SectionAdvantages({
  advantages,
  images,
  className,
}: SectionAdvantagesProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 desktop:grid-cols-3">
          <div className="flex h-[300px] md:h-[343px] desktop:h-[461px] flex-col items-center justify-center bg-[var(--color-gold)] px-10 text-center">
            <div className="flex items-center gap-0">
              <Icon name="diamond" size={30} />
              <Icon name="diamondAlt" size={30} />
              <Icon name="diamond" size={30} />
            </div>
            <p className="mt-4 text-xl font-medium leading-[1.1] text-[var(--color-foreground)] desktop:text-[24px] max-w-[391px]">
              {advantages[0]?.title}
            </p>
          </div>
          <div className="relative h-[300px] md:h-[343px] desktop:h-[461px]">
            <Image
              src={images[0] || ""}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex h-[300px] md:h-[343px] desktop:h-[461px] flex-col items-center justify-center bg-[var(--color-gold)] px-10 text-center">
            <div className="flex items-center gap-0">
              <Icon name="diamond" size={30} />
              <Icon name="diamondAlt" size={30} />
              <Icon name="diamond" size={30} />
            </div>
            <p className="mt-4 text-xl font-medium leading-[1.1] text-[var(--color-foreground)] desktop:text-[24px] max-w-[391px]">
              {advantages[1]?.title}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 desktop:grid-cols-3">
          <div className="relative h-[300px] md:h-[343px] desktop:h-[461px]">
            <Image
              src={images[1] || ""}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex h-[300px] md:h-[343px] desktop:h-[461px] flex-col items-center justify-center bg-[var(--color-gold)] px-10 text-center">
            <div className="flex items-center gap-0">
              <Icon name="diamond" size={30} />
              <Icon name="diamondAlt" size={30} />
              <Icon name="diamond" size={30} />
            </div>
            <p className="mt-4 text-xl font-medium leading-[1.1] text-[var(--color-foreground)] desktop:text-[24px] max-w-[391px]">
              {advantages[2]?.title ?? advantages[0]?.title}
            </p>
          </div>
          <div className="relative h-[300px] md:h-[343px] desktop:h-[461px]">
            <Image
              src={images[2] || ""}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}
