"use client";

import { useState } from "react";
import { loyaltyFaq } from "@/data/loyalty";

export function LoyaltyFAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="bg-[var(--color-selection)]">
      <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 py-10 md:py-12 desktop:py-20">
        <div className="flex flex-col desktop:flex-row gap-6 desktop:gap-[162px] desktop:items-start">
          <h2 className="text-[22px] md:text-[28px] desktop:text-[40px] font-medium leading-[1.1] text-[var(--color-foreground)] desktop:shrink-0">
            Часто задаваемые вопросы
          </h2>
          <div className="flex-1 desktop:max-w-[593px]">
            {loyaltyFaq.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="border-b border-[var(--color-gray-light)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between py-3 text-left text-sm desktop:text-base font-medium text-[var(--color-foreground)] hover:text-[var(--color-brand)] transition-colors"
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
