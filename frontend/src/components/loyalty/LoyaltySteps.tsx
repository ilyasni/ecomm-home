"use client";

import { Icon } from "@/design-system/icons";
import { loyaltySteps as defaultLoyaltySteps } from "@/data/loyalty";
import type { LoyaltyStep } from "@/data/loyalty";

type LoyaltyStepsProps = {
  data?: LoyaltyStep[];
};

export function LoyaltySteps({ data }: LoyaltyStepsProps) {
  const loyaltySteps = data ?? defaultLoyaltySteps;
  return (
    <section className="desktop:px-0 mx-auto w-full max-w-[1400px] px-4 md:px-[39px]">
      <div className="desktop:grid-cols-4 grid grid-cols-1 gap-2 md:grid-cols-2">
        {loyaltySteps.map((step) => (
          <div
            key={step.id}
            className="desktop:px-[43px] desktop:py-[85px] desktop:aspect-square flex min-h-[272px] flex-col justify-between overflow-hidden bg-[var(--color-selection)] px-8 py-14"
          >
            <div className="flex items-center">
              {Array.from({ length: step.iconsCount }).map((_, i) => (
                <Icon key={i} name={i % 2 === 0 ? "diamond" : "diamondAlt"} size={24} />
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-3 pt-6">
              <h3 className="desktop:text-lg text-base leading-[1.1] font-medium whitespace-pre-line text-[var(--color-foreground)]">
                {step.title}
              </h3>
              <p className="desktop:text-base text-sm leading-[1.3] text-[var(--color-dark)]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
