"use client";

import type { InfoCardData } from "@/data/customer-info";

type InfoCardProps = {
  card: InfoCardData;
};

export function InfoCard({ card }: InfoCardProps) {
  return (
    <div className="border border-[var(--color-gray-light)] rounded-[5px] p-6 desktop:p-8">
      <h3 className="text-lg font-medium leading-[1.1] desktop:text-xl">
        {card.title}
      </h3>
      {card.highlight && (
        <p className="mt-4 text-sm font-medium leading-[1.5] text-[var(--color-brand)] desktop:text-base">
          {card.highlight}
        </p>
      )}
      <div className="mt-4 flex flex-col gap-4">
        {card.paragraphs.map((p, idx) => (
          <p
            key={idx}
            className="text-sm leading-[1.5] text-[var(--color-dark)] desktop:text-base whitespace-pre-line"
          >
            {p}
          </p>
        ))}
      </div>
      {card.link && (
        <a
          href={card.link.href}
          className="mt-4 inline-block text-sm text-[var(--color-brand)] underline"
        >
          {card.link.label}
        </a>
      )}
    </div>
  );
}
