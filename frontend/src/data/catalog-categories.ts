export type CategoryCardData = {
  id: string;
  title: string;
  count: number;
  image: string;
  href: string;
};

export const catalogCategoryCards: CategoryCardData[] = [
  {
    id: "bed-linen",
    title: "Постельное белье",
    count: 205,
    image: "/assets/figma/placeholder.svg",
    href: "/catalog/bed-linen",
  },
  {
    id: "home-textile",
    title: "Домашний текстиль",
    count: 205,
    image: "/assets/figma/placeholder.svg",
    href: "/catalog/home-textile",
  },
  {
    id: "blankets",
    title: "Одеяла",
    count: 10,
    image: "/assets/figma/placeholder.svg",
    href: "/catalog/blankets",
  },
  {
    id: "pillows",
    title: "Подушки",
    count: 58,
    image: "/assets/figma/placeholder.svg",
    href: "/catalog/pillows",
  },
  {
    id: "plaids",
    title: "Пледы",
    count: 20,
    image: "/assets/figma/placeholder.svg",
    href: "/catalog/plaids",
  },
  {
    id: "towels",
    title: "Полотенца",
    count: 28,
    image: "/assets/figma/placeholder.svg",
    href: "/catalog/towels",
  },
  {
    id: "boudoir",
    title: "Будуарные наряды",
    count: 85,
    image: "/assets/figma/placeholder.svg",
    href: "/catalog/boudoir",
  },
];
