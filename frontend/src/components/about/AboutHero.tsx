"use client";

import Image from "next/image";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { aboutHero as defaultAboutHero } from "@/data/about";

const breadcrumbs = [{ label: "Главная", href: "/" }, { label: "О бренде" }];

interface AboutHeroProps {
  title?: string;
  desktopImage?: string;
  mobileImage?: string;
}

export function AboutHero(props: AboutHeroProps) {
  const aboutHero = {
    title: props.title ?? defaultAboutHero.title,
    desktopImage: props.desktopImage ?? defaultAboutHero.desktopImage,
    mobileImage: props.mobileImage ?? defaultAboutHero.mobileImage,
  };

  return (
    <section className="desktop:h-[700px] relative h-[420px] overflow-hidden md:h-[503px]">
      <Image
        src={aboutHero.desktopImage}
        alt="О бренде Vita Brava Home"
        fill
        className="desktop:block hidden object-cover"
        priority
        unoptimized
      />
      <Image
        src={aboutHero.mobileImage}
        alt="О бренде Vita Brava Home"
        fill
        className="desktop:hidden object-cover"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-[rgba(17,10,0,0.25)]" />

      <div className="desktop:px-0 relative mx-auto flex h-full max-w-[1400px] flex-col px-4 md:px-[39px]">
        <div className="desktop:pt-[119px] pt-[86px] md:pt-[89px]">
          <Breadcrumbs items={breadcrumbs} variant="light" />
        </div>
        <div className="desktop:mb-16 mt-auto mb-10 max-w-[558px] text-[var(--color-light)]">
          <h1 className="desktop:text-[40px] text-[26px] leading-[1.1] font-medium whitespace-pre-line md:text-[32px]">
            {aboutHero.title}
          </h1>
        </div>
      </div>
    </section>
  );
}
