import type { Product } from "@/components/catalog/ProductCard";

export type SetItem = {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  oldPrice?: string;
  image: string;
  sizes: Array<{ value: string; label: string }>;
};

export const setProducts: Product[] = [
  {
    id: "set-1",
    title: "Комплект постельного белья Петербург",
    description: "Сатин, хлопок-батист, плотность класса 400 ТС",
    price: "23 800 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/placeholder.svg",
    badge: "-15%",
    rating: 4.5,
    sku: "4829401",
    colors: [
      { name: "бежевый", hex: "#D4C5B0" },
      { name: "белый", hex: "#F5F0EB" },
      { name: "серый", hex: "#A8A5A0" },
    ],
  },
  {
    id: "set-2",
    title: "Комплект постельного белья Петербург",
    description: "Белый утиный пух в хлопке-батисте, плотность класса 400 ТС",
    price: "33 800 ₽",
    image: "/assets/figma/placeholder.svg",
    rating: 4.5,
    sku: "4829402",
    colors: [
      { name: "белый", hex: "#F5F0EB" },
      { name: "бежевый", hex: "#D4C5B0" },
    ],
  },
  {
    id: "set-3",
    title: "Комплект постельного белья Ария Минк",
    description: "Однотонный комплект из премиального сатина, плотность класса 400 ТС",
    price: "24 900 ₽",
    image: "/assets/figma/placeholder.svg",
    badge: "Эксклюзив",
    rating: 5,
    sku: "4829403",
    colors: [
      { name: "коричневый", hex: "#6B4C3B" },
      { name: "белый", hex: "#F5F0EB" },
      { name: "голубой", hex: "#B0C4DE" },
    ],
  },
  {
    id: "set-4",
    title: "Комплект постельного белья Филигрань",
    description: "Сатин, хлопок-батист, плотность класса 400 ТС",
    price: "15 000 ₽",
    image: "/assets/figma/placeholder.svg",
    rating: 4.5,
    sku: "4829404",
    colors: [
      { name: "бежевый", hex: "#D4C5B0" },
      { name: "белый", hex: "#F5F0EB" },
    ],
  },
  {
    id: "set-5",
    title: "Комплект постельного белья Петербург",
    description: "Белый утиный пух в хлопке-батисте",
    price: "от 24 900 ₽",
    image: "/assets/figma/placeholder.svg",
    rating: 4.5,
    sku: "4829405",
    colors: [
      { name: "серый", hex: "#A8A5A0" },
      { name: "белый", hex: "#F5F0EB" },
      { name: "бежевый", hex: "#D4C5B0" },
    ],
  },
  {
    id: "set-6",
    title: "Комплект постельного белья Ария Минк",
    description: "Однотонный комплект из премиального сатина",
    price: "15 000 ₽",
    image: "/assets/figma/placeholder.svg",
    badge: "-25%",
    rating: 5,
    sku: "4829406",
    colors: [
      { name: "коричневый", hex: "#6B4C3B" },
      { name: "белый", hex: "#F5F0EB" },
    ],
  },
  {
    id: "set-7",
    title: "Комплект постельного белья Петербург",
    description: "Сатин, хлопок-батист, плотность класса 400 ТС",
    price: "5 000 ₽",
    oldPrice: "8 000 ₽",
    image: "/assets/figma/placeholder.svg",
    badge: "-15%",
    rating: 4.5,
    sku: "4829407",
  },
  {
    id: "set-8",
    title: "Комплект постельного белья Петербург",
    description: "Белый утиный пух в хлопке-батисте",
    price: "49 000 ₽",
    image: "/assets/figma/placeholder.svg",
    rating: 4.5,
    sku: "4829408",
  },
  {
    id: "set-9",
    title: "Комплект постельного белья Ария Минк",
    description: "Однотонный комплект из премиального сатина",
    price: "15 000 ₽",
    image: "/assets/figma/placeholder.svg",
    badge: "Эксклюзив",
    rating: 5,
    sku: "4829409",
  },
  {
    id: "set-10",
    title: "Комплект постельного белья Филигрань",
    description: "Сатин, хлопок-батист, плотность класса 400 ТС",
    price: "28 000 ₽",
    image: "/assets/figma/placeholder.svg",
    rating: 4.5,
    sku: "4829410",
  },
  {
    id: "set-11",
    title: "Комплект постельного белья Петербург",
    description: "Сатин, хлопок-батист, плотность класса 400 ТС",
    price: "49 000 ₽",
    image: "/assets/figma/placeholder.svg",
    rating: 4.5,
    sku: "4829411",
  },
  {
    id: "set-12",
    title: "Комплект постельного белья Ария Минк",
    description: "Однотонный комплект из премиального сатина",
    price: "15 000 ₽",
    image: "/assets/figma/placeholder.svg",
    badge: "Новинка",
    rating: 5,
    sku: "4829412",
  },
];

const defaultSizes = [
  { value: "50x70", label: "50×70 см" },
  { value: "70x70", label: "70×70 см" },
];

const sheetSizes = [
  { value: "160x200", label: "160×200 см" },
  { value: "180x200", label: "180×200 см" },
  { value: "200x200", label: "200×200 см" },
];

const duvetSizes = [
  { value: "150x210", label: "150×210 см" },
  { value: "200x200", label: "200×200 см" },
  { value: "200x220", label: "200×220 см" },
];

export const setItems: Record<string, SetItem[]> = {
  "set-1": [
    {
      id: "set-1-pillowcases",
      title: "Комплект наволочек Арья Минк",
      subtitle: "2 шт. (50×70 см)",
      price: "10 000 ₽",
      oldPrice: "15 000 ₽",
      image: "/assets/figma/placeholder.svg",
      sizes: defaultSizes,
    },
    {
      id: "set-1-sheet",
      title: "Простыня Арья Минк",
      subtitle: "На резинке (200×200 см)",
      price: "7 990 ₽",
      image: "/assets/figma/placeholder.svg",
      sizes: sheetSizes,
    },
    {
      id: "set-1-duvet",
      title: "Пододеяльник Арья Минк",
      subtitle: "(200×200 см)",
      price: "15 000 ₽",
      image: "/assets/figma/placeholder.svg",
      sizes: duvetSizes,
    },
  ],
  "set-2": [
    {
      id: "set-2-pillowcases",
      title: "Комплект наволочек Петербург",
      subtitle: "2 шт. (70×70 см)",
      price: "12 000 ₽",
      image: "/assets/figma/placeholder.svg",
      sizes: defaultSizes,
    },
    {
      id: "set-2-sheet",
      title: "Простыня Петербург",
      subtitle: "На резинке (180×200 см)",
      price: "9 990 ₽",
      image: "/assets/figma/placeholder.svg",
      sizes: sheetSizes,
    },
    {
      id: "set-2-duvet",
      title: "Пододеяльник Петербург",
      subtitle: "(200×220 см)",
      price: "18 000 ₽",
      image: "/assets/figma/placeholder.svg",
      sizes: duvetSizes,
    },
  ],
  "set-3": [
    {
      id: "set-3-pillowcases",
      title: "Комплект наволочек Ария Минк",
      subtitle: "2 шт. (50×70 см)",
      price: "10 000 ₽",
      oldPrice: "15 000 ₽",
      image: "/assets/figma/placeholder.svg",
      sizes: defaultSizes,
    },
    {
      id: "set-3-sheet",
      title: "Простыня Ария Минк",
      subtitle: "На резинке (200×200 см)",
      price: "7 990 ₽",
      image: "/assets/figma/placeholder.svg",
      sizes: sheetSizes,
    },
    {
      id: "set-3-duvet",
      title: "Пододеяльник Ария Минк",
      subtitle: "(200×200 см)",
      price: "15 000 ₽",
      image: "/assets/figma/placeholder.svg",
      sizes: duvetSizes,
    },
  ],
};

const defaultSetItems: SetItem[] = [
  {
    id: "default-pillowcases",
    title: "Комплект наволочек",
    subtitle: "2 шт. (50×70 см)",
    price: "10 000 ₽",
    image: "/assets/figma/placeholder.svg",
    sizes: defaultSizes,
  },
  {
    id: "default-sheet",
    title: "Простыня",
    subtitle: "На резинке (200×200 см)",
    price: "10 000 ₽",
    image: "/assets/figma/placeholder.svg",
    sizes: sheetSizes,
  },
  {
    id: "default-duvet",
    title: "Пододеяльник",
    subtitle: "(200×200 см)",
    price: "15 000 ₽",
    image: "/assets/figma/placeholder.svg",
    sizes: duvetSizes,
  },
];

export function getSetItems(productId: string): SetItem[] {
  return setItems[productId] || defaultSetItems;
}
