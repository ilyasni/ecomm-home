"use client";

import Image from "next/image";
import { Button } from "@/design-system/components";

type DesignersProps = {
  title?: string;
  text?: string;
  image?: string;
  buttonLabel?: string;
};

const defaults = {
  title: "Приглашаем\nк сотрудничеству",
  text: "Дизайнеров интерьеров, владельцев отелей, декораторов, хоумстейджеров и всех заинтересованных",
  image: "/assets/figma/placeholder.svg",
  buttonLabel: "Узнать условия",
};

export function Designers({
  title = defaults.title,
  text = defaults.text,
  image = defaults.image,
  buttonLabel = defaults.buttonLabel,
}: DesignersProps) {
  return (
    <section className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
      <div className="desktop:grid-cols-2 grid gap-2 md:grid-cols-2">
        <div className="desktop:px-[56px] desktop:h-[660px] flex items-center justify-center bg-[var(--color-selection)] px-6 py-16 text-center md:h-[343px]">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-6">
              <h2 className="desktop:text-[40px] max-w-[541px] text-[26px] leading-[1.1] font-medium whitespace-pre-line">
                {title}
              </h2>
              <p className="desktop:text-base max-w-[442px] text-sm leading-[1.3] text-[var(--color-dark)]">
                {text}
              </p>
            </div>
            <Button variant="primary" type="button">
              {buttonLabel}
            </Button>
          </div>
        </div>
        <div className="desktop:h-[660px] relative h-[343px]">
          <Image
            src={image}
            alt={title.replace(/\n/g, " ")}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
