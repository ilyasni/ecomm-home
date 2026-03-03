import Image from "next/image";
import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { getBoutiques } from "@/lib/queries/boutiques";
import { withFallback } from "@/lib/with-fallback";
import { getStrapiMediaUrl } from "@/lib/strapi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бутики — Vita Brava Home",
  description: "Адреса и контакты бутиков Vita Brava Home в Москве и по всей России",
};

export default async function BoutiquesPage() {
  const boutiques = await withFallback(async () => {
    const res = await getBoutiques();
    return res.data ?? [];
  }, []);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer variant="solid" />

      <main className="desktop:pt-[160px] pt-[120px] md:pt-[140px]">
        {/* Заголовок */}
        <section className="desktop:px-0 desktop:py-16 mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
          <h1 className="desktop:text-[48px] text-[28px] leading-[1.1] font-medium md:text-[36px]">
            Бутики
          </h1>
          <p className="desktop:mt-6 mt-4 text-sm leading-[1.5] text-[var(--color-dark)] md:text-base">
            Посетите наши бутики и оцените качество премиального текстиля лично
          </p>
        </section>

        {/* Список бутиков */}
        <section className="desktop:px-0 desktop:pb-24 mx-auto max-w-[1400px] px-4 pb-16 md:px-[39px]">
          {boutiques.length === 0 ? (
            <p className="text-[var(--color-dark)]">
              Информация о бутиках временно недоступна. Пожалуйста, свяжитесь с нами.
            </p>
          ) : (
            <div className="desktop:grid-cols-3 grid grid-cols-1 gap-8 md:grid-cols-2">
              {boutiques.map((boutique) => {
                const mapImageUrl = boutique.mapImage?.url
                  ? getStrapiMediaUrl(boutique.mapImage.url)
                  : null;

                return (
                  <article
                    key={boutique.documentId}
                    className="flex flex-col overflow-hidden border border-[var(--color-gray-light)]"
                  >
                    {/* Карта / фото */}
                    <div className="relative h-[220px] bg-[var(--color-selection)]">
                      {mapImageUrl ? (
                        <Image
                          src={mapImageUrl}
                          alt={`Карта — ${boutique.name}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-sm text-[var(--color-gray)]">Карта недоступна</span>
                        </div>
                      )}
                    </div>

                    {/* Информация */}
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div>
                        <p className="text-xs tracking-wider text-[var(--color-gray)] uppercase">
                          {boutique.city}
                        </p>
                        <h2 className="mt-1 text-lg leading-[1.2] font-medium">{boutique.name}</h2>
                      </div>

                      <div className="flex flex-col gap-2 text-sm leading-[1.5] text-[var(--color-dark)]">
                        <p>{boutique.address}</p>

                        {boutique.metro && (
                          <p>
                            <span className="text-[var(--color-gray)]">м. </span>
                            {boutique.metro}
                            {boutique.metroDetail && (
                              <span className="text-[var(--color-gray)]">
                                {" "}
                                — {boutique.metroDetail}
                              </span>
                            )}
                          </p>
                        )}

                        {(boutique.schedule || boutique.scheduleTime || boutique.workingHours) && (
                          <p>
                            <span className="text-[var(--color-gray)]">Режим работы: </span>
                            {boutique.workingHours ??
                              [boutique.schedule, boutique.scheduleTime].filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto flex flex-col gap-1 text-sm">
                        {boutique.phone && (
                          <a
                            href={`tel:${boutique.phone.replace(/\s/g, "")}`}
                            className="text-[var(--color-brand)] hover:underline"
                          >
                            {boutique.phone}
                          </a>
                        )}
                        {boutique.email && (
                          <a
                            href={`mailto:${boutique.email}`}
                            className="text-[var(--color-gray)] hover:underline"
                          >
                            {boutique.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <FooterServer />
    </div>
  );
}
