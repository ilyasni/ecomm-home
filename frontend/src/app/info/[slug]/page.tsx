"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ArticleContent } from "@/components/info";
import { infoPages } from "@/data/info-pages";

export default function InfoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const page = infoPages.find((p) => p.slug === slug);

  if (!page) {
    return (
      <div className="bg-[var(--background)] text-[var(--foreground)]">
        <Header variant="solid" />
        <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px]">
          <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 py-20 text-center">
            <h1 className="text-[28px] font-medium leading-[1.1] desktop:text-[40px]">
              Страница не найдена
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: page.breadcrumbLabel },
  ];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="mx-auto max-w-[1043px] px-4 md:px-[39px] desktop:px-0 mt-8 mb-16 desktop:mb-20">
          <h1 className="text-[26px] md:text-[32px] desktop:text-[40px] font-medium leading-[1.1]">
            {page.title}
          </h1>

          <div className="mt-8 desktop:mt-10">
            <ArticleContent sections={page.sections} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
