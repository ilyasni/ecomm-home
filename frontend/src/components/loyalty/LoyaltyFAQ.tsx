"use client";

import { useState } from "react";
import { loyaltyFaq as defaultLoyaltyFaq } from "@/data/loyalty";
import type { LoyaltyFaqItem } from "@/data/loyalty";

type LoyaltyFAQProps = {
  data?: LoyaltyFaqItem[];
};

export function LoyaltyFAQ({ data }: LoyaltyFAQProps) {
  const loyaltyFaq = data ?? defaultLoyaltyFaq;
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="bg-[var(--color-selection)]">
      <div className="desktop:px-0 desktop:py-20 mx-auto max-w-[1400px] px-4 py-10 md:px-[39px] md:py-12">
        <div className="desktop:flex-row desktop:gap-[162px] desktop:items-start flex flex-col gap-6">
          <h2 className="desktop:text-[40px] desktop:shrink-0 text-[22px] leading-[1.1] font-medium text-[var(--color-foreground)] md:text-[28px]">
            Часто задаваемые вопросы
          </h2>
          <div className="desktop:max-w-[593px] flex-1">
            {loyaltyFaq.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="border-b border-[var(--color-gray-light)]">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="desktop:text-base flex w-full items-center justify-between py-3 text-left text-sm font-medium text-[var(--color-foreground)] transition-colors hover:text-[var(--color-brand)]"
                  >
                    <span className="pr-4">{item.question}</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </button>
                  {isOpen && (
                    <p className="pb-4 text-sm leading-[1.5] text-[var(--color-dark-gray)]">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
