"use client";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { SectionAdvantages } from "@/components/shared/SectionAdvantages";
import {
  AboutHero,
  AboutIntro,
  AboutHistory,
  AboutCollections,
  AboutProduction,
  AboutCreating,
} from "@/components/about";
import { aboutAdvantages, aboutAdvantageImages } from "@/data/about";

export default function AboutPage() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <main>
        <AboutHero />
        <AboutIntro />

        <SectionAdvantages
          advantages={aboutAdvantages}
          images={aboutAdvantageImages}
          className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0"
        />

        <AboutHistory />
        <AboutCollections />
        <AboutProduction />
        <AboutCreating />
      </main>
      <Footer />
    </div>
  );
}
