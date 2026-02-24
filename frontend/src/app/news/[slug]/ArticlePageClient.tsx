"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ArticleTOC } from "@/components/news/ArticleTOC";
import { ArticleBody } from "@/components/news/ArticleBody";
import { RecommendBlog } from "@/components/news/RecommendBlog";
import { ReadAlsoSection } from "@/components/news/ReadAlsoSection";
import type { ArticleData } from "@/data/news";

interface ArticlePageClientProps {
  slug: string;
  title: string;
  category: string;
  image: string;
  excerpt?: string;
  article: ArticleData | null;
}

export function ArticlePageClient({
  slug,
  title,
  category,
  image,
  excerpt,
  article,
}: ArticlePageClientProps) {
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Новости", href: "/news" },
    { label: "Блог", href: "/news" },
    { label: title },
  ];

  const recommendInsertIndex = article ? Math.floor(article.sections.length * 0.6) : -1;

  const sectionsBefore =
    article && recommendInsertIndex >= 0
      ? article.sections.slice(0, recommendInsertIndex)
      : article?.sections || [];

  const sectionsAfter =
    article && recommendInsertIndex >= 0 ? article.sections.slice(recommendInsertIndex) : [];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]">
        <div className="desktop:px-0 mx-auto mt-6 max-w-[1400px] px-4 md:px-[39px]">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="desktop:px-0 mx-auto mt-6 max-w-[1162px] px-4 md:mt-8 md:px-[39px]">
          <div className="text-center">
            <Link
              href="/news"
              className="desktop:text-[16px] text-[14px] leading-[1.3] font-normal text-[var(--color-brand)] capitalize hover:underline"
            >
              {category}
            </Link>
          </div>

          <h1 className="desktop:text-[36px] mt-4 text-[24px] leading-[1.1] font-medium text-[var(--color-black)] md:text-[32px]">
            {title}
          </h1>

          {article && article.toc.length > 0 && (
            <div className="mt-6 md:mt-8">
              <ArticleTOC items={article.toc} />
            </div>
          )}

          <div className="desktop:h-[501px] relative mt-6 h-[188px] w-full overflow-hidden rounded-[5px] md:mt-8 md:h-[350px]">
            <Image src={image} alt={title} fill className="object-cover" unoptimized />
          </div>
        </div>

        {article ? (
          <div className="desktop:px-0 mx-auto mt-8 max-w-[1162px] px-4 md:mt-10 md:px-[39px]">
            <div className="max-w-[1043px]">
              <ArticleBody sections={sectionsBefore} />
            </div>
            <RecommendBlog className="mt-8 md:mt-10" />
            {sectionsAfter.length > 0 && (
              <div className="mt-8 max-w-[1043px] md:mt-10">
                <ArticleBody sections={sectionsAfter} />
              </div>
            )}
          </div>
        ) : (
          <div className="desktop:px-0 mx-auto mt-8 max-w-[1162px] px-4 md:mt-10 md:px-[39px]">
            <div className="max-w-[1043px]">
              <p className="text-[16px] leading-[1.5] text-[var(--color-dark)]">{excerpt}</p>
            </div>
          </div>
        )}

        <div className="desktop:px-0 mx-auto mt-16 max-w-[1400px] px-4 md:mt-20 md:px-[39px]">
          <ReadAlsoSection currentSlug={slug} />
        </div>

        <div className="mt-16 md:mt-20" />
      </main>
      <Footer />
    </div>
  );
}
