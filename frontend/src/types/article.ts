export type NewsCategory = "все" | "новости" | "идеи" | "новинки" | "ткани";

export interface NewsItem {
  id: string;
  slug: string;
  category: Exclude<NewsCategory, "все">;
  date: string;
  title: string;
  excerpt: string;
  image: string;
}

export interface ArticleTOCItem {
  id: string;
  label: string;
}

export interface ArticleSection {
  type: "heading" | "text" | "list" | "images" | "table";
  id?: string;
  content?: string;
  items?: string[];
  images?: { src: string; alt: string }[];
  rows?: { cells: string[] }[];
  headers?: string[];
}

export interface ArticleData {
  slug: string;
  category: Exclude<NewsCategory, "все">;
  title: string;
  image: string;
  date: string;
  toc: ArticleTOCItem[];
  sections: ArticleSection[];
}
