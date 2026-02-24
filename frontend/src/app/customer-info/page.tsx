import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { CustomerInfoClient } from "@/components/customer-info";
import { getCustomerInfoPage } from "@/lib/queries/content-pages";
import { withFallback } from "@/lib/with-fallback";
import type { InfoCategory, InfoCardData, DeliveryTab } from "@/data/customer-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Информация для покупателей",
  description: "Доставка, оплата, возврат и обмен — информация для покупателей Vita Brava Home.",
};

export default async function CustomerInfoPage() {
  const strapiData = await withFallback(async () => {
    const res = await getCustomerInfoPage();
    const d = res.data as Record<string, unknown>;

    const categories = d.categories as Record<string, unknown>[] | null;

    return (
      categories?.map((cat, ci) => {
        const tabs = cat.tabs as Record<string, unknown>[] | null;
        const cards = cat.cards as Record<string, unknown>[] | null;

        return {
          id: (cat.id as string) ?? `cat-${ci + 1}`,
          label: cat.label as string,
          title: cat.title as string,
          tabs:
            tabs?.map(
              (t) =>
                ({
                  id: t.id as string,
                  label: t.label as string,
                }) satisfies DeliveryTab
            ) ?? undefined,
          cards:
            cards?.map((c, cardIdx) => {
              const link = c.link as Record<string, unknown> | null;
              return {
                id: (c.id as string) ?? `card-${cardIdx + 1}`,
                title: c.title as string,
                highlight: (c.highlight as string) ?? undefined,
                paragraphs: (c.paragraphs as string[]) ?? [],
                link: link ? { label: link.label as string, href: link.href as string } : undefined,
              } satisfies InfoCardData;
            }) ?? [],
        } satisfies InfoCategory;
      }) ?? null
    );
  }, null);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]">
        <div className="desktop:px-0 mx-auto mt-6 max-w-[1400px] px-4 md:mt-8 md:px-[39px]">
          <h1 className="desktop:text-[40px] text-center text-[26px] leading-[1.1] font-medium md:text-[32px]">
            Информация для покупателя
          </h1>
        </div>

        <CustomerInfoClient categories={strapiData ?? undefined} />
      </main>
      <FooterServer />
    </div>
  );
}
