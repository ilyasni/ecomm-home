"use client";

import { Button } from "@/design-system/components";
import { aboutIntro } from "@/data/about";

export function AboutIntro() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 py-10 desktop:py-[80px]">
      <div className="flex justify-end">
        <div className="w-full desktop:max-w-[606px]">
          <p className="text-sm leading-[1.5] text-[var(--color-dark)] desktop:text-base whitespace-pre-line">
            {aboutIntro.text}
          </p>
          <div className="mt-8">
            <Button variant="primary" type="button">
              {aboutIntro.buttonLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
