import type { Product } from "@/components/catalog/ProductCard";

export type Collection = {
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
};

export const collections: Collection[] = [
  {
    slug: "medium",
    title: "Коллекция Medium",
    heroTitle: "Medium коллекция",
    heroSubtitle:
      "Коллекция Medium — идеальное решение для\nсовременного интерьера и комфортного сна",
    heroImages: [
      "/assets/figma/placeholder.svg",
      "/assets/figma/placeholder.svg",
      "/assets/figma/placeholder.svg",
    ],
    descriptionTitle: "Коллекция Medium — вдохновлённая спокойствием океана",
    descriptionParagraphs: [
      "Линейка нашей коллекции — прекрасная! Ты сможешь в белом, голубом и её цвета окунуться в мировой океан. Они доступны в нежной палитре, спокойные тона которой напомнят о стелющихся средиземноморских волнах.",
      "Коллекция Medium — это элегантное и удобное постельное бельё, подходящее для ежедневного использования. Мы создали эту линейку, чтобы каждый мог позволить себе ощущение роскоши дома.",
    ],
    mediaImage: "/assets/figma/placeholder.svg",
    mediaVideo: "/assets/figma/placeholder.svg",
    bannerTitle: "Какая подушка подойдет именно вам?",
    bannerDescription: "Специальный тест поможет подобрать идеальную подушку для вас",
    bannerButtonLabel: "Пройти тест",
    bannerImage: "/assets/figma/placeholder.svg",
    products: [
      {
        id: "col-1",
        title: "Комплект постельного белья Петербург",
        description: "Белый утиный пух в хлопке-батисте",
        price: "от 45 000 ₽",
        oldPrice: "50 000 ₽",
        image: "/assets/figma/placeholder.svg",
        rating: 5,
      },
      {
        id: "col-2",
        title: "Наволочка Чёрный Соболь",
        description: "Белый утиный пух в хлопке-батисте",
        price: "15 000 ₽",
        image: "/assets/figma/placeholder.svg",
        badge: "-15%",
        rating: 5,
      },
      {
        id: "col-3",
        title: "Плед",
        description: "Белый утиный пух в хлопке-батисте",
        price: "15 000 ₽",
        image: "/assets/figma/placeholder.svg",
        rating: 5,
      },
      {
        id: "col-4",
        title: "Наволочка Гладкий Соболь",
        description: "Белый утиный пух в хлопке-батисте",
        price: "15 000 ₽",
        image: "/assets/figma/placeholder.svg",
        rating: 5,
      },
      {
        id: "col-5",
        title: "Кашемировая подушка",
        description: "Белый утиный пух в хлопке-батисте",
        price: "15 000 ₽",
        image: "/assets/figma/placeholder.svg",
        rating: 5,
      },
      {
        id: "col-6",
        title: "Микро-гель подушка",
        description: "Белый утиный пух в хлопке-батисте",
        price: "15 850 ₽",
        image: "/assets/figma/placeholder.svg",
        rating: 5,
      },
    ],
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
