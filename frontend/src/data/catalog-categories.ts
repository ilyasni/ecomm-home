export type CategoryCardData = {
  id: string;
  title: string;
  count: number;
  image: string;
  href: string;
};

export const catalogCategoryCards: CategoryCardData[] = [
  { id: "bed-linen", title: "Постельное белье", count: 205, image: "/assets/figma/categories/bed.jpg", href: "/catalog/bed-linen" },
  { id: "home-textile", title: "Домашний текстиль", count: 205, image: "/assets/figma/categories/home-textile.jpg", href: "/catalog/home-textile" },
  { id: "blankets", title: "Одеяла", count: 10, image: "/assets/figma/categories/blanket.jpg", href: "/catalog/blankets" },
  { id: "pillows", title: "Подушки", count: 58, image: "/assets/figma/categories/pillows.jpg", href: "/catalog/pillows" },
  { id: "plaids", title: "Пледы", count: 20, image: "/assets/figma/categories/throws.jpg", href: "/catalog/plaids" },
  { id: "towels", title: "Полотенца", count: 28, image: "/assets/figma/categories/towels.jpg", href: "/catalog/towels" },
  { id: "boudoir", title: "Будуарные наряды", count: 85, image: "/assets/figma/categories/boudoir.jpg", href: "/catalog/boudoir" },
];
