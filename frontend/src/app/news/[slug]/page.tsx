import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/queries/articles";
import { withFallback } from "@/lib/with-fallback";
import { mapMedia } from "@/lib/mappers";
import { articleData, newsList } from "@/data/news";
import type { ArticleData } from "@/data/news";
import { ArticlePageClient } from "./ArticlePageClient";

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
    const title = strapiData.title as string;
    const category = (strapiData.category as string) ?? "новости";
    const image = mapMedia(strapiData.image as never) || "/assets/figma/placeholder.svg";

    return (
      <ArticlePageClient
        slug={slug}
        title={title}
        category={category}
        image={image}
        article={null}
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
