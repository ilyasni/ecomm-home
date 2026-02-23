"use client";

import Image from "next/image";
import { partnerOfferItems } from "@/data/cooperation";

export function PartnerOffer() {
  return (
    <section className="relative">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-[350px] md:h-auto md:w-1/2">
          <Image
            src="/assets/figma/cooperation/partner-offer.jpg"
            alt="Сотрудничество"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="bg-[var(--color-selection)] p-6 md:p-8 desktop:p-12 md:w-1/2 flex items-center">
          <div>
            <h2 className="text-[22px] md:text-[26px] desktop:text-[28px] font-medium leading-[1.1]">
              Что мы предлагаем нашим партнёрам
            </h2>
            <div className="mt-6 desktop:mt-8 flex flex-col gap-4 desktop:gap-6">
              {partnerOfferItems.map((item, idx) => (
                <div key={item.id} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-xs text-white font-medium">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-[1.3] desktop:text-base">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-dark)] leading-[1.3]">
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
