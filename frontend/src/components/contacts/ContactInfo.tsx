"use client";

import Image from "next/image";
import { contactInfo } from "@/data/contacts";

export function ContactInfo() {
  return (
    <div className="flex flex-col md:flex-row gap-0">
      <div className="relative h-[322px] w-full md:w-1/2">
        <Image
          src={contactInfo.image}
          alt="Бутик Vita Brava Home"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="bg-[var(--color-selection)] p-6 md:p-8 desktop:p-10 md:w-1/2 flex flex-col justify-center">
        <div>
          <p className="text-base font-medium leading-[1.3]">
            Позвонить и написать
          </p>
          <div className="mt-4 flex flex-col md:flex-row gap-3 md:gap-6">
            <a
              href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-[var(--color-brand)] underline"
            >
              <span>📞</span> {contactInfo.phone}
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-2 text-sm text-[var(--color-brand)] underline"
            >
              <span>✉️</span> {contactInfo.email}
            </a>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-base font-medium leading-[1.3]">Мы в соцсетях</p>
          <div className="mt-4 flex gap-6">
            {contactInfo.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-sm text-[var(--color-brand)] underline"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
