import type { Product } from "./product";

export interface Collection {
  slug: string;
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImages: string[];
  descriptionTitle: string;
  descriptionParagraphs: string[];
  mediaImage: string;
  mediaVideo: string;
  bannerTitle: string;
  bannerDescription: string;
  bannerButtonLabel: string;
  bannerImage: string;
  products: Product[];
}

export interface BudgetCollection {
  id: string;
  title: string;
  price: string;
  image: string;
}
