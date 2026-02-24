"use client";

import Image from "next/image";
import { contactInfo as defaultContactInfo } from "@/data/contacts";

interface ContactInfoProps {
  data?: {
    phone: string;
    email: string;
    socials: { label: string; href: string }[];
    image?: string;
  };
}

export function ContactInfo({ data }: ContactInfoProps) {
  const contactInfo = {
    ...defaultContactInfo,
    ...data,
    image: data?.image ?? defaultContactInfo.image,
  };

  return (
    <div className="flex flex-col gap-0 md:flex-row">
      <div className="relative h-[322px] w-full md:w-1/2">
        {contactInfo.image && (
          <Image
            src={contactInfo.image}
            alt="Бутик Vita Brava Home"
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>
      <div className="desktop:p-10 flex flex-col justify-center bg-[var(--color-selection)] p-6 md:w-1/2 md:p-8">
        <div>
          <p className="text-base leading-[1.3] font-medium">Позвонить и написать</p>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:gap-6">
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
          <p className="text-base leading-[1.3] font-medium">Мы в соцсетях</p>
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
