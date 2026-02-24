"use client";

import Image from "next/image";
import { specialOffers as defaultSpecialOffers } from "@/data/special-offers";
import type { SpecialOffer } from "@/data/special-offers";

type OffersGridProps = {
  data?: SpecialOffer[];
};

export function OffersGrid({ data }: OffersGridProps) {
  const specialOffers = data ?? defaultSpecialOffers;
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {specialOffers.map((offer) => (
        <a
          key={offer.id}
          href="#"
          className="group desktop:h-[450px] relative h-[220px] overflow-hidden md:h-[340px]"
        >
          <Image
            src={offer.image}
            alt={offer.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute right-6 bottom-6 left-6 text-[var(--color-light)]">
            <h3 className="desktop:text-2xl text-lg leading-[1.1] font-medium md:text-xl">
              {offer.title}
            </h3>
            <p className="mt-2 text-sm leading-[1.3] opacity-90">{offer.subtitle}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
