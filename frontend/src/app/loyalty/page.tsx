"use client";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import {
  LoyaltyHero,
  LoyaltySteps,
  BalanceCheck,
  LoyaltyFAQ,
} from "@/components/loyalty";

export default function LoyaltyPage() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="flex flex-col gap-10 md:gap-12 desktop:gap-20 pt-[78px] md:pt-[81px] desktop:pt-[111px]">
        <LoyaltyHero />
        <LoyaltySteps />
        <BalanceCheck />
        <LoyaltyFAQ />
      </main>
      <Footer />
    </div>
  );
}
