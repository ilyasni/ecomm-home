import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { OffersGrid, BonusSection, NewsSlider } from "@/components/special-offers";
import { getSpecialOffersPage } from "@/lib/queries/content-pages";
import { withFallback } from "@/lib/with-fallback";
import { mapMediaOrPlaceholder } from "@/lib/mappers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Акции и спецпредложения",
  description: "Актуальные акции и специальные предложения от Vita Brava Home.",
};

const breadcrumbs = [{ label: "Главная", href: "/" }, { label: "Специальные предложения" }];

export default async function SpecialOffersPage() {
  const strapiData = await withFallback(async () => {
    const res = await getSpecialOffersPage();
    const d = res.data as Record<string, unknown>;

    const offers = d.offers as Record<string, unknown>[] | null;
    const bonus = d.bonusSection as Record<string, unknown> | null;
    const bonusImage = bonus?.image as Record<string, unknown> | null;

    return {
      offers:
        offers?.map((o, i) => ({
          id: `offer-${i + 1}`,
          title: o.title as string,
          subtitle: o.subtitle as string,
          image: mapMediaOrPlaceholder(
            (o.image ?? o.coverImage) as Parameters<typeof mapMediaOrPlaceholder>[0]
          ),
        })) ?? [],
      bonusSection: bonus
        ? {
            title: bonus.title as string,
            description: bonus.description as string,
            buttonLabel: bonus.buttonLabel as string,
            image: mapMediaOrPlaceholder(bonusImage as Parameters<typeof mapMediaOrPlaceholder>[0]),
          }
        : undefined,
    };
  }, null);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]">
        <div className="desktop:px-0 mx-auto mt-6 max-w-[1400px] px-4 md:px-[39px]">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="desktop:px-0 mx-auto mt-6 max-w-[1400px] px-4 md:mt-8 md:px-[39px]">
          <h1 className="desktop:text-[40px] text-center text-[26px] leading-[1.1] font-medium md:text-[32px]">
            Специальные предложения
            <br />
            от Vita Brava Home
          </h1>
        </div>

        <div className="desktop:px-0 desktop:mt-10 mx-auto mt-8 max-w-[1400px] px-4 md:px-[39px]">
          <OffersGrid data={strapiData?.offers} />
        </div>

        <div className="desktop:px-0 desktop:mt-16 mx-auto mt-12 max-w-[1400px] px-4 md:px-[39px]">
          <BonusSection data={strapiData?.bonusSection} />
        </div>

        <NewsSlider />
      </main>
      <FooterServer />
    </div>
  );
}
