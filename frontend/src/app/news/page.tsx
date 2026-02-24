import { NewsPageContent } from "@/components/news/NewsPageContent";
import { getArticles } from "@/lib/queries/articles";
import { withFallback } from "@/lib/with-fallback";
import { mapMediaOrPlaceholder, formatDate } from "@/lib/mappers";
import type { NewsItem, NewsCategory } from "@/data/news";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новости и блог",
  description: "Новости, статьи и полезные советы от Vita Brava Home.",
};

export default async function NewsPage() {
  const articlesData = await withFallback(async () => {
    const res = await getArticles({ pageSize: 50 });
    return res.data;
  }, null);

  const articles = articlesData?.map((a: Record<string, unknown>) => ({
    id: String((a as { documentId: string }).documentId),
    slug: a.slug as string,
    category: a.category as Exclude<NewsCategory, "все">,
    date: formatDate(a.date as string),
    title: a.title as string,
    excerpt: (a.excerpt as string) ?? "",
    image: mapMediaOrPlaceholder(a.image as never),
  })) as NewsItem[] | undefined;

  return <NewsPageContent articles={articles} />;
}
