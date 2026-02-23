"use client";

import { cooperationIntro } from "@/data/cooperation";

export function CooperationIntro() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 py-10 desktop:py-[80px]">
      <div className="flex justify-end">
        <p className="w-full desktop:max-w-[606px] text-sm leading-[1.5] text-[var(--color-dark)] desktop:text-base">
          {cooperationIntro}
        </p>
      </div>
    </section>
  );
}
