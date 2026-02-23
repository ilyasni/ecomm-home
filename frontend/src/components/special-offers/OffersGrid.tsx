"use client";

import Image from "next/image";
import { specialOffers } from "@/data/special-offers";

export function OffersGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {specialOffers.map((offer) => (
        <a
          key={offer.id}
          href="#"
          className="group relative h-[220px] md:h-[340px] desktop:h-[450px] overflow-hidden"
        >
          <Image
            src={offer.image}
            alt={offer.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-[var(--color-light)]">
            <h3 className="text-lg md:text-xl desktop:text-2xl font-medium leading-[1.1]">
              {offer.title}
            </h3>
            <p className="mt-2 text-sm leading-[1.3] opacity-90">
              {offer.subtitle}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
