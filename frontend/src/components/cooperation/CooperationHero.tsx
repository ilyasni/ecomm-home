"use client";

import Image from "next/image";
import { ArrowLink } from "@/design-system/components";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { cooperationHero as defaultCooperationHero } from "@/data/cooperation";

const breadcrumbs = [{ label: "Главная", href: "/" }, { label: "Сотрудничество" }];

interface CooperationHeroProps {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  desktopImage?: string;
  mobileImage?: string;
}

export function CooperationHero(props: CooperationHeroProps) {
  const cooperationHero = {
    title: props.title ?? defaultCooperationHero.title,
    subtitle: props.subtitle ?? defaultCooperationHero.subtitle,
    buttonLabel: props.buttonLabel ?? defaultCooperationHero.buttonLabel,
    desktopImage: props.desktopImage ?? defaultCooperationHero.desktopImage,
    mobileImage: props.mobileImage ?? defaultCooperationHero.mobileImage,
  };

  return (
    <section className="desktop:h-[700px] relative h-[500px] overflow-hidden md:h-[503px]">
      <Image
        src={cooperationHero.desktopImage}
        alt="Сотрудничество"
        fill
        className="desktop:block hidden object-cover"
        priority
        unoptimized
      />
      <Image
        src={cooperationHero.mobileImage}
        alt="Сотрудничество"
        fill
        className="desktop:hidden object-cover"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-[var(--overlay-dark-warm)]" />

      <div className="desktop:px-0 relative mx-auto flex h-full max-w-[1400px] flex-col px-4 md:px-[39px]">
        <div className="desktop:pt-[119px] pt-[86px] md:pt-[89px]">
          <Breadcrumbs items={breadcrumbs} variant="light" />
        </div>
        <div className="desktop:mb-16 mt-auto mb-10 max-w-[500px] text-[var(--color-light)]">
          <h1 className="desktop:text-[40px] text-[26px] leading-[1.1] font-medium whitespace-pre-line md:text-[32px]">
            {cooperationHero.title}
          </h1>
          <p className="desktop:text-base mt-4 text-sm leading-[1.3] opacity-90">
            {cooperationHero.subtitle}
          </p>
          <div className="mt-6">
            <ArrowLink label={cooperationHero.buttonLabel} size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
