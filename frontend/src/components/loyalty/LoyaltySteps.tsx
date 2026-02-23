"use client";

import { Icon } from "@/design-system/icons";
import { loyaltySteps } from "@/data/loyalty";

export function LoyaltySteps() {
  return (
    <section className="w-full mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 desktop:grid-cols-4 gap-2">
        {loyaltySteps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col justify-between bg-[var(--color-selection)] px-8 py-14 desktop:px-[43px] desktop:py-[85px] min-h-[272px] desktop:aspect-square overflow-hidden"
          >
            <div className="flex items-center">
              {Array.from({ length: step.iconsCount }).map((_, i) => (
                <Icon
                  key={i}
                  name={i % 2 === 0 ? "diamond" : "diamondAlt"}
                  size={24}
                />
              ))}
            </div>
            <div className="flex flex-col gap-3 mt-auto pt-6">
              <h3 className="text-base desktop:text-lg font-medium leading-[1.1] text-[var(--color-foreground)] whitespace-pre-line">
                {step.title}
              </h3>
              <p className="text-sm desktop:text-base leading-[1.3] text-[var(--color-dark)]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
