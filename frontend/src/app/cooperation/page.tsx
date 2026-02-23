"use client";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/design-system/components";
import { SectionAdvantages } from "@/components/shared/SectionAdvantages";
import {
  CooperationHero,
  CooperationIntro,
  PartnerOffer,
  PartnershipForm,
} from "@/components/cooperation";
import {
  cooperationAdvantages,
  cooperationAdvantageImages,
} from "@/data/cooperation";

export default function CooperationPage() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <main>
        <CooperationHero />
        <CooperationIntro />
        <PartnerOffer />

        <section className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 py-10 desktop:py-[80px]">
          <h2 className="text-center text-[22px] md:text-[28px] desktop:text-[32px] font-medium leading-[1.1] max-w-[500px] mx-auto">
            Почему сотрудничество с нами – комфортно и выгодно
          </h2>
          <div className="mt-8 desktop:mt-10">
            <SectionAdvantages
              advantages={cooperationAdvantages}
              images={cooperationAdvantageImages}
            />
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="primary" type="button">
              Стать партнёром
            </Button>
          </div>
        </section>

        <PartnershipForm />
      </main>
      <Footer />
    </div>
  );
}
