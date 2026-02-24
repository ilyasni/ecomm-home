import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ContactInfo, BoutiqueCards, ContactForm } from "@/components/contacts";
import { getContactsPage } from "@/lib/queries/content-pages";
import { withFallback } from "@/lib/with-fallback";
import { mapMediaOrPlaceholder } from "@/lib/mappers";
import type { StrapiMedia } from "@/types/strapi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты Vita Brava Home — адреса бутиков, телефон и форма обратной связи.",
};

const breadcrumbs = [{ label: "Главная", href: "/" }, { label: "Контакты" }];

export default async function ContactsPage() {
  const strapiData = await withFallback(async () => {
    const res = await getContactsPage();
    return res.data as Record<string, unknown>;
  }, null);

  const contactInfoProps = strapiData
    ? {
        data: {
          phone: strapiData.phone as string,
          email: strapiData.email as string,
          socials: (strapiData.socials as Record<string, unknown>[])?.map((s) => ({
            label: s.label as string,
            href: s.href as string,
          })),
          image: mapMediaOrPlaceholder(strapiData.image as StrapiMedia),
        },
      }
    : {};

  const boutiqueProps = strapiData
    ? {
        items: (strapiData.boutiques as Record<string, unknown>[])?.map((b) => ({
          id: String(b.id),
          city: b.city as string,
          address: b.address as string,
          metro: b.metro as string,
          metroDetail: b.metroDetail as string,
          schedule: b.schedule as string,
          scheduleTime: b.scheduleTime as string,
          phone: b.phone as string,
          email: b.email as string,
          mapImage: mapMediaOrPlaceholder(b.mapImage as StrapiMedia),
        })),
      }
    : {};

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]">
        <div className="desktop:px-0 mx-auto mt-6 max-w-[1400px] px-4 md:px-[39px]">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="desktop:px-0 mx-auto mt-6 max-w-[1400px] px-4 md:mt-8 md:px-[39px]">
          <h1 className="desktop:text-[40px] text-center text-[26px] leading-[1.1] font-medium md:text-[32px]">
            Контакты для связи
          </h1>
        </div>

        <div className="desktop:px-0 desktop:mt-10 mx-auto mt-8 max-w-[1400px] px-4 md:px-[39px]">
          <ContactInfo {...contactInfoProps} />
        </div>

        <div className="desktop:px-0 desktop:mt-16 mx-auto mt-12 max-w-[1400px] px-4 md:px-[39px]">
          <BoutiqueCards {...boutiqueProps} />
        </div>

        <div className="desktop:px-0 desktop:mt-16 desktop:mb-20 mx-auto mt-12 mb-16 max-w-[1400px] px-4 md:px-[39px]">
          <ContactForm />
        </div>
      </main>
      <FooterServer />
    </div>
  );
}
