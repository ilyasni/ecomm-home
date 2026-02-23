"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";

type CollectionBannerProps = {
  title: string;
  description: string;
  buttonLabel: string;
  image: string;
};

export function CollectionBanner({
  title,
  description,
  buttonLabel,
  image,
}: CollectionBannerProps) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 py-10 md:py-12 desktop:py-20">
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col justify-center bg-[var(--color-selection)] p-8 md:p-10 desktop:p-16 md:w-1/2">
          <h2 className="text-[22px] md:text-[26px] desktop:text-[32px] font-medium leading-[1.1]">
            {title}
          </h2>
          <p className="mt-4 desktop:mt-6 text-sm desktop:text-base text-[var(--color-dark)] leading-[1.5] max-w-[512px]">
            {description}
          </p>
          <div className="mt-6 desktop:mt-8">
            <Button variant="primary" type="button">
              {buttonLabel}
            </Button>
          </div>
        </div>
        <div className="relative h-[340px] md:h-auto md:w-1/2">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
