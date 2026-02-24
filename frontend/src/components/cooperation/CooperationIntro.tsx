"use client";

import { cooperationIntro as defaultCooperationIntro } from "@/data/cooperation";

interface CooperationIntroProps {
  text?: string;
}

export function CooperationIntro({ text }: CooperationIntroProps) {
  const cooperationIntro = text ?? defaultCooperationIntro;

  return (
    <section className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
      <div className="flex justify-end">
        <p className="desktop:max-w-[606px] desktop:text-base w-full text-sm leading-[1.5] text-[var(--color-dark)]">
          {cooperationIntro}
        </p>
      </div>
    </section>
  );
}
