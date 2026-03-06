import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/queries/articles";
import { withFallback } from "@/lib/with-fallback";
import { mapMedia } from "@/lib/mappers";
import { articleData, newsList } from "@/data/news";
import type { ArticleData, ArticleSection, ArticleTOCItem } from "@/data/news";
import { ArticlePageClient } from "./ArticlePageClient";

type StrapiSection = { __component: string; id: number; anchorId?: string; content?: string };
type StrapiTOCItem = { id: number; anchorId: string; label: string };

function mapStrapiArticle(data: Record<string, unknown>): ArticleData {
  const rawSections = (data.sections as StrapiSection[] | undefined) ?? [];
  const rawToc = (data.toc as StrapiTOCItem[] | undefined) ?? [];

  const sections: ArticleSection[] = rawSections.map((s) => {
    if (s.__component === "article.section-heading") {
      return { type: "heading", id: s.anchorId, content: s.content ?? "" };
    }
    return { type: "text", content: s.content ?? "" };
  });

  const toc: ArticleTOCItem[] = rawToc.map((t) => ({
    id: t.anchorId,
    label: t.label,
  }));

  return {
    slug: data.slug as string,
    category: (data.category as ArticleData["category"]) ?? "новости",
    title: data.title as string,
    image: mapMedia(data.image as never) ?? "",
    date: (data.date as string) ?? "",
    toc,
    sections,
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const data = await withFallback(async () => {
    const res = await getArticleBySlug(slug);
    return res.data;
  }, null);

  const title =
    (data?.title as string) ??
    (articleData.slug === slug ? articleData.title : null) ??
    newsList.find((n) => n.slug === slug)?.title ??
    "Статья";

  return {
    title,
    description: `${title} — Блог Vita Brava Home`,
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const strapiData = await withFallback(async () => {
    const res = await getArticleBySlug(slug);
    return res.data as Record<string, unknown>;
  }, null);

  if (strapiData) {
    const article = mapStrapiArticle(strapiData);

    return (
      <ArticlePageClient
        slug={slug}
        title={article.title}
        category={article.category}
        image={article.image || "/assets/figma/placeholder.svg"}
        article={article}
        excerpt={(strapiData.excerpt as string) ?? ""}
      />
    );
  }

  const newsItem = newsList.find((n) => n.slug === slug);
  const article: ArticleData | null = articleData.slug === slug ? articleData : null;

  const title = article?.title || newsItem?.title || "Статья";
  const category = article?.category || newsItem?.category || "новости";
  const image = article?.image || newsItem?.image || "/assets/figma/placeholder.svg";

  return (
    <ArticlePageClient
      slug={slug}
      title={title}
      category={category}
      image={image}
      article={article}
      excerpt={newsItem?.excerpt}
    />
  );
}
