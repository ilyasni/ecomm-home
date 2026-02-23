"use client";

import Image from "next/image";
import { boutiques } from "@/data/contacts";

export function BoutiqueCards() {
  return (
    <div>
      <h2 className="text-[22px] md:text-[26px] desktop:text-[28px] font-medium leading-[1.1]">
        Адреса бутиков
      </h2>
      <div className="mt-6 desktop:mt-8 grid grid-cols-1 md:grid-cols-2 desktop:grid-cols-3 gap-6 desktop:gap-[30px]">
        {boutiques.map((b) => (
          <div key={b.id} className="flex flex-col">
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-medium leading-[1.1]">{b.city}</h3>
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
            <div className="relative mt-4 h-[250px] md:h-[300px] desktop:h-[304px] w-full overflow-hidden rounded-[5px]">
              <Image
                src={b.mapImage}
                alt={`Карта — ${b.city}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
