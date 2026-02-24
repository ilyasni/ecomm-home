"use client";

import Image from "next/image";
import { partnerOfferItems as defaultPartnerOfferItems } from "@/data/cooperation";

interface PartnerOfferProps {
  items?: { id: string; title: string; description: string }[];
}

export function PartnerOffer({ items }: PartnerOfferProps) {
  const partnerOfferItems = items ?? defaultPartnerOfferItems;

  return (
    <section className="relative">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-[350px] md:h-auto md:w-1/2">
          <Image
            src="/assets/figma/placeholder.svg"
            alt="Сотрудничество"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="desktop:p-12 flex items-center bg-[var(--color-selection)] p-6 md:w-1/2 md:p-8">
          <div>
            <h2 className="desktop:text-[28px] text-[22px] leading-[1.1] font-medium md:text-[26px]">
              Что мы предлагаем нашим партнёрам
            </h2>
            <div className="desktop:mt-8 desktop:gap-6 mt-6 flex flex-col gap-4">
              {partnerOfferItems.map((item, idx) => (
                <div key={item.id} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-xs font-medium text-white">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="desktop:text-base text-sm leading-[1.3] font-medium">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-[1.3] text-[var(--color-dark)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
