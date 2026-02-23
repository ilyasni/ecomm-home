"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ArticleTOC } from "@/components/news/ArticleTOC";
import { ArticleBody } from "@/components/news/ArticleBody";
import { RecommendBlog } from "@/components/news/RecommendBlog";
import { ReadAlsoSection } from "@/components/news/ReadAlsoSection";
import { articleData, newsList } from "@/data/news";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function NewsArticlePage({ params }: PageProps) {
  const { slug } = use(params);

  const newsItem = newsList.find((n) => n.slug === slug);
  const article = articleData.slug === slug ? articleData : null;

  const title = article?.title || newsItem?.title || "Статья";
  const category = article?.category || newsItem?.category || "новости";
  const image = article?.image || newsItem?.image || "/assets/figma/news/news-1.jpg";

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Новости", href: "/news" },
    { label: "Блог", href: "/news" },
    { label: title },
  ];

  const recommendInsertIndex = article
    ? Math.floor(article.sections.length * 0.6)
    : -1;

  const sectionsBefore =
    article && recommendInsertIndex >= 0
      ? article.sections.slice(0, recommendInsertIndex)
      : article?.sections || [];

  const sectionsAfter =
    article && recommendInsertIndex >= 0
      ? article.sections.slice(recommendInsertIndex)
      : [];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px]">
        {/* Breadcrumbs */}
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Шапка статьи */}
        <div className="mx-auto max-w-[1162px] px-4 md:px-[39px] desktop:px-0 mt-6 md:mt-8">
          {/* Рубрика */}
          <div className="text-center">
            <Link
              href="/news"
              className="text-[14px] desktop:text-[16px] font-normal leading-[1.3] text-[var(--color-brand)] hover:underline capitalize"
            >
              {category}
            </Link>
          </div>

          {/* Заголовок */}
          <h1 className="mt-4 text-[24px] md:text-[32px] desktop:text-[36px] font-medium leading-[1.1] text-[var(--color-black)]">
            {title}
          </h1>

          {/* TOC */}
          {article && article.toc.length > 0 && (
            <div className="mt-6 md:mt-8">
              <ArticleTOC items={article.toc} />
            </div>
          )}

          {/* Главное изображение */}
          <div className="mt-6 md:mt-8 relative w-full h-[188px] md:h-[350px] desktop:h-[501px] overflow-hidden rounded-[5px]">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Контент статьи */}
        {article ? (
          <div className="mx-auto max-w-[1162px] px-4 md:px-[39px] desktop:px-0 mt-8 md:mt-10">
            {/* Часть до рекомендаций */}
            <div className="max-w-[1043px]">
              <ArticleBody sections={sectionsBefore} />
            </div>

            {/* Товарная рекомендация */}
            <RecommendBlog className="mt-8 md:mt-10" />

            {/* Часть после рекомендаций */}
            {sectionsAfter.length > 0 && (
              <div className="max-w-[1043px] mt-8 md:mt-10">
                <ArticleBody sections={sectionsAfter} />
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-[1162px] px-4 md:px-[39px] desktop:px-0 mt-8 md:mt-10">
            <div className="max-w-[1043px]">
              <p className="text-[16px] leading-[1.5] text-[var(--color-dark)]">
                {newsItem?.excerpt}
              </p>
            </div>
          </div>
        )}

        {/* Читайте также */}
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-16 md:mt-20">
          <ReadAlsoSection currentSlug={slug} />
        </div>

        <div className="mt-16 md:mt-20" />
      </main>
      <Footer />
    </div>
  );
}
