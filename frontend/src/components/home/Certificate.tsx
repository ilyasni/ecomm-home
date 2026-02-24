"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";

type CertificateProps = {
  title?: string;
  text?: string;
  image?: string;
  buttonLabel?: string;
};

const defaults = {
  title: "Подарок, которому будет рад каждый",
  text: "Хотите сделать приятный сюрприз для близкого, но не знаете, что выбрать? Наш подарочный сертификат позволит вам легко и быстро решить эту проблему.",
  image: "/assets/figma/placeholder.svg",
  buttonLabel: "Выбрать сертификат",
};

export function Certificate({
  title = defaults.title,
  text = defaults.text,
  image = defaults.image,
  buttonLabel = defaults.buttonLabel,
}: CertificateProps) {
  return (
    <section className="desktop:h-[660px] relative overflow-hidden bg-[var(--color-gold)] md:h-auto">
      <div className="desktop:px-0 desktop:py-0 desktop:h-full relative mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
        <div className="desktop:h-full flex flex-col gap-8 md:flex-row md:items-stretch">
          <div className="desktop:h-auto desktop:w-[620px] desktop:shrink-0 relative h-[280px] w-full overflow-hidden md:h-[343px] md:w-1/2 md:shrink-0">
            <Image src={image} alt={title} fill className="object-cover" unoptimized />
          </div>
          <div className="desktop:py-0 flex items-center py-4">
            <div className="flex max-w-[495px] flex-col gap-8">
              <div className="flex flex-col gap-6">
                <h2 className="desktop:text-[40px] text-[26px] leading-[1.1] font-medium">
                  {title}
                </h2>
                <p className="desktop:text-base max-w-[420px] text-sm leading-[1.3] text-[var(--color-dark)]">
                  {text}
                </p>
              </div>
              <div>
                <Button variant="primary" type="button">
                  {buttonLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
