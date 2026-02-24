"use client";

import Image from "next/image";
import { boutiques as defaultBoutiques, type BoutiqueAddress } from "@/data/contacts";

interface BoutiqueCardsProps {
  items?: BoutiqueAddress[];
}

export function BoutiqueCards({ items }: BoutiqueCardsProps) {
  const boutiques = items ?? defaultBoutiques;

  return (
    <div>
      <h2 className="desktop:text-[28px] text-[22px] leading-[1.1] font-medium md:text-[26px]">
        Адреса бутиков
      </h2>
      <div className="desktop:mt-8 desktop:grid-cols-3 desktop:gap-[30px] mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {boutiques.map((b) => (
          <div key={b.id} className="flex flex-col">
            <div className="flex flex-col gap-3">
              <h3 className="text-lg leading-[1.1] font-medium">{b.city}</h3>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--color-gray)]">📍</span>
                <span className="text-sm leading-[1.5]">{b.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--color-brand)]">Ⓜ</span>
                <span className="text-sm leading-[1.5]">
                  {b.metro} {b.metroDetail}
                </span>
              </div>
              <div>
                <p className="text-sm leading-[1.5]">{b.schedule}</p>
                <p className="text-sm leading-[1.5]">{b.scheduleTime}</p>
              </div>
              <div className="flex flex-col gap-1">
                <a
                  href={`tel:${b.phone.replace(/\s/g, "")}`}
                  className="text-sm text-[var(--color-brand)] underline"
                >
                  {b.phone}
                </a>
                <a
                  href={`mailto:${b.email}`}
                  className="text-sm text-[var(--color-brand)] underline"
                >
                  {b.email}
                </a>
              </div>
            </div>
            <div className="desktop:h-[304px] relative mt-4 h-[250px] w-full overflow-hidden rounded-[5px] md:h-[300px]">
              {b.mapImage && (
                <Image
                  src={b.mapImage}
                  alt={`Карта — ${b.city}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
