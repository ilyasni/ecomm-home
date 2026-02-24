import type { Metadata } from "next";
import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ArticleContent } from "@/components/info";
import { infoPages as defaultInfoPages, type InfoPageData } from "@/data/info-pages";
import { getInfoPageBySlug } from "@/lib/queries/content-pages";
import { withFallback } from "@/lib/with-fallback";

interface InfoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: InfoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await withFallback(async () => {
    const res = await getInfoPageBySlug(slug);
    return res.data;
  }, null);

  const title =
    (data?.title as string) ?? defaultInfoPages.find((p) => p.slug === slug)?.title ?? "Информация";

  return {
    title,
    description: `${title} — Vita Brava Home`,
  };
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params;

  const strapiData = await withFallback(async () => {
    const res = await getInfoPageBySlug(slug);
    return res.data;
  }, null);

  const page: InfoPageData | undefined = strapiData
    ? {
        slug: strapiData.slug as string,
        title: strapiData.title as string,
        breadcrumbLabel: (strapiData.breadcrumbLabel as string) ?? "",
        sections: ((strapiData.sections as Record<string, unknown>[]) ?? []).map(
          (s: Record<string, unknown>) => ({
            title: s.title as string,
            paragraphs: (s.paragraphs as string[]) ?? [],
          })
        ),
      }
    : defaultInfoPages.find((p) => p.slug === slug);

  if (!page) {
    return (
      <div className="bg-[var(--background)] text-[var(--foreground)]">
        <HeaderServer variant="solid" />
        <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]">
          <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 py-20 text-center md:px-[39px]">
            <h1 className="desktop:text-[40px] text-[28px] leading-[1.1] font-medium">
              Страница не найдена
            </h1>
          </div>
        </main>
        <FooterServer />
      </div>
    );
  }

  const breadcrumbs = [{ label: "Главная", href: "/" }, { label: page.breadcrumbLabel }];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]">
        <div className="desktop:px-0 mx-auto mt-6 max-w-[1400px] px-4 md:px-[39px]">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="desktop:px-0 desktop:mb-20 mx-auto mt-8 mb-16 max-w-[1043px] px-4 md:px-[39px]">
          <h1 className="desktop:text-[40px] text-[26px] leading-[1.1] font-medium md:text-[32px]">
            {page.title}
          </h1>

          <div className="desktop:mt-10 mt-8">
            <ArticleContent sections={page.sections} />
          </div>
        </div>
      </main>
      <FooterServer />
    </div>
  );
}
