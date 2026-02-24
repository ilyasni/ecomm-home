"use client";

import { Button } from "@/design-system/components";
import { aboutIntro as defaultAboutIntro } from "@/data/about";

interface AboutIntroProps {
  text?: string;
  buttonLabel?: string;
}

export function AboutIntro(props: AboutIntroProps) {
  const aboutIntro = {
    text: props.text ?? defaultAboutIntro.text,
    buttonLabel: props.buttonLabel ?? defaultAboutIntro.buttonLabel,
  };

  return (
    <section className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
      <div className="flex justify-end">
        <div className="desktop:max-w-[606px] w-full">
          <p className="desktop:text-base text-sm leading-[1.5] whitespace-pre-line text-[var(--color-dark)]">
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
