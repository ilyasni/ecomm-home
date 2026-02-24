import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { Button } from "@/design-system/components";
import { SectionAdvantages } from "@/components/shared/SectionAdvantages";
import {
  CooperationHero,
  CooperationIntro,
  PartnerOffer,
  PartnershipForm,
} from "@/components/cooperation";
import { cooperationAdvantages, cooperationAdvantageImages } from "@/data/cooperation";
import { getCooperationPage } from "@/lib/queries/content-pages";
import { withFallback } from "@/lib/with-fallback";
import { mapMediaOrPlaceholder } from "@/lib/mappers";
import type { StrapiMedia } from "@/types/strapi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сотрудничество",
  description:
    "Партнёрская программа Vita Brava Home — условия сотрудничества для оптовых покупателей.",
};

export default async function CooperationPage() {
  const strapiData = await withFallback(async () => {
    const res = await getCooperationPage();
    return res.data as Record<string, unknown>;
  }, null);

  const heroProps = strapiData
    ? {
        title: strapiData.heroTitle as string,
        subtitle: strapiData.heroSubtitle as string,
        buttonLabel: strapiData.heroButtonLabel as string,
        desktopImage: mapMediaOrPlaceholder(strapiData.heroDesktopImage as StrapiMedia),
        mobileImage: mapMediaOrPlaceholder(strapiData.heroMobileImage as StrapiMedia),
      }
    : {};

  const introProps = strapiData ? { text: strapiData.introText as string } : {};

  const offerProps = strapiData
    ? {
        items: (strapiData.partnerOfferItems as Record<string, unknown>[])?.map((item) => ({
          id: String(item.id),
          title: item.title as string,
          description: item.description as string,
        })),
      }
    : {};

  const advantages = strapiData
    ? (strapiData.advantages as Record<string, unknown>[])?.map((a) => ({
        id: String(a.id),
        title: a.title as string,
      }))
    : cooperationAdvantages;

  const advantageImages = strapiData
    ? ((strapiData.advantageImages as StrapiMedia[])?.map((img) => mapMediaOrPlaceholder(img)) ??
      cooperationAdvantageImages)
    : cooperationAdvantageImages;

  const formProps = strapiData
    ? {
        title: strapiData.partnershipFormTitle as string,
        subtitle: strapiData.partnershipFormSubtitle as string,
        image: mapMediaOrPlaceholder(strapiData.partnershipFormImage as StrapiMedia),
      }
    : {};

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer />
      <main>
        <CooperationHero {...heroProps} />
        <CooperationIntro {...introProps} />
        <PartnerOffer {...offerProps} />

        <section className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
          <h2 className="desktop:text-[32px] mx-auto max-w-[500px] text-center text-[22px] leading-[1.1] font-medium md:text-[28px]">
            Почему сотрудничество с нами – комфортно и выгодно
          </h2>
          <div className="desktop:mt-10 mt-8">
            <SectionAdvantages advantages={advantages} images={advantageImages} />
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="primary" type="button">
              Стать партнёром
            </Button>
          </div>
        </section>

        <PartnershipForm {...formProps} />
      </main>
      <FooterServer />
    </div>
  );
}
