import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { LoyaltyHero, LoyaltySteps, BalanceCheck, LoyaltyFAQ } from "@/components/loyalty";
import { getLoyaltyPage } from "@/lib/queries/content-pages";
import { withFallback } from "@/lib/with-fallback";
import { mapMediaOrPlaceholder } from "@/lib/mappers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Программа лояльности",
  description: "Программа лояльности Vita Brava Home — накапливайте бонусы и получайте скидки.",
};

export default async function LoyaltyPage() {
  const strapiData = await withFallback(async () => {
    const res = await getLoyaltyPage();
    const d = res.data as Record<string, unknown>;

    const heroImage = d.heroImage as Record<string, unknown> | null;
    const balanceCheckData = d.balanceCheck as Record<string, unknown> | null;
    const balanceCheckImage = balanceCheckData?.image as Record<string, unknown> | null;
    const steps = d.steps as Record<string, unknown>[] | null;
    const faq = d.faq as Record<string, unknown>[] | null;

    return {
      hero: {
        title: d.heroTitle as string,
        description: d.heroDescription as string,
        buttonLabel: d.heroButtonLabel as string,
        image: mapMediaOrPlaceholder(heroImage as Parameters<typeof mapMediaOrPlaceholder>[0]),
      },
      steps:
        steps?.map((s, i) => ({
          id: `step-${i + 1}`,
          iconsCount: s.iconsCount as number,
          title: s.title as string,
          description: s.description as string,
        })) ?? [],
      balanceCheck: balanceCheckData
        ? {
            title: balanceCheckData.title as string,
            description: balanceCheckData.description as string,
            buttonLabel: balanceCheckData.buttonLabel as string,
            image: mapMediaOrPlaceholder(
              balanceCheckImage as Parameters<typeof mapMediaOrPlaceholder>[0]
            ),
          }
        : undefined,
      faq:
        faq?.map((f, i) => ({
          id: `faq-${i + 1}`,
          question: f.question as string,
          answer: f.answer as string,
        })) ?? [],
    };
  }, null);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer variant="solid" />
      <main className="desktop:gap-20 desktop:pt-[111px] flex flex-col gap-10 pt-[78px] md:gap-12 md:pt-[81px]">
        <LoyaltyHero data={strapiData?.hero} />
        <LoyaltySteps data={strapiData?.steps} />
        <BalanceCheck data={strapiData?.balanceCheck} />
        <LoyaltyFAQ data={strapiData?.faq} />
      </main>
      <FooterServer />
    </div>
  );
}
