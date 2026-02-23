export type CatalogSubcategory = {
  label: string;
  href: string;
};

export type CatalogFilter = {
  title: string;
  options: { label: string; href: string }[];
};

export type CatalogCategory = {
  id: string;
  label: string;
  icon: string;
  href: string;
  subcategories?: CatalogSubcategory[];
  filters?: CatalogFilter[];
};

export type CatalogExtraLink = {
  label: string;
  href: string;
  hasSubmenu?: boolean;
};

export type CatalogInfoLink = {
  label: string;
  href: string;
  hasSubmenu?: boolean;
};

export const catalogCategories: CatalogCategory[] = [
  {
    id: "bed-linen",
    label: "Постельное белье",
    icon: "catalogBedLinen",
    href: "/catalog/bed-linen",
    subcategories: [
      { label: "Комплекты", href: "/catalog/bed-linen/sets" },
      { label: "Конструктор", href: "/catalog/bed-linen/constructor" },
      { label: "Наволочки", href: "/catalog/bed-linen/pillowcases" },
      { label: "Простыни", href: "/catalog/bed-linen/sheets" },
      { label: "Пододеяльники", href: "/catalog/bed-linen/duvet-covers" },
    ],
    filters: [
      {
        title: "Ткань",
        options: [
          { label: "Хлопок", href: "/catalog/bed-linen?fabric=cotton" },
          { label: "Сатин", href: "/catalog/bed-linen?fabric=satin" },
          { label: "Лен", href: "/catalog/bed-linen?fabric=linen" },
          { label: "Хлопок", href: "/catalog/bed-linen?fabric=cotton2" },
          { label: "Сатин", href: "/catalog/bed-linen?fabric=satin2" },
        ],
      },
      {
        title: "Плотность ткани",
        options: [
          { label: "200 TC", href: "/catalog/bed-linen?density=200" },
          { label: "300 TC", href: "/catalog/bed-linen?density=300" },
          { label: "400 TC", href: "/catalog/bed-linen?density=400" },
          { label: "500 TC", href: "/catalog/bed-linen?density=500" },
          { label: "600 TC", href: "/catalog/bed-linen?density=600" },
        ],
      },
      {
        title: "Цвет",
        options: [
          { label: "Белый", href: "/catalog/bed-linen?color=white" },
          { label: "Бежевый", href: "/catalog/bed-linen?color=beige" },
          { label: "Песочный", href: "/catalog/bed-linen?color=sand" },
          { label: "Зеленый", href: "/catalog/bed-linen?color=green" },
          { label: "Синий", href: "/catalog/bed-linen?color=blue" },
        ],
      },
    ],
  },
  {
    id: "home-textile",
    label: "Домашний текстиль",
    icon: "catalogHomeTextile",
    href: "/catalog/home-textile",
    subcategories: [
      { label: "Скатерти", href: "/catalog/home-textile/tablecloths" },
      { label: "Салфетки", href: "/catalog/home-textile/napkins" },
      { label: "Дорожки", href: "/catalog/home-textile/runners" },
    ],
  },
  {
    id: "blankets",
    label: "Одеяла",
    icon: "catalogBlankets",
    href: "/catalog/blankets",
  },
  {
    id: "pillows",
    label: "Подушки",
    icon: "catalogPillows",
    href: "/catalog/pillows",
  },
  {
    id: "plaids",
    label: "Пледы",
    icon: "catalogPlaids",
    href: "/catalog/plaids",
  },
  {
    id: "towels",
    label: "Полотенца",
    icon: "catalogTowels",
    href: "/catalog/towels",
  },
  {
    id: "boudoir",
    label: "Будуарные наряды",
    icon: "catalogBoudoir",
    href: "/catalog/boudoir",
  },
];

export const catalogExtraLinks: CatalogExtraLink[] = [
  { label: "Подарочные сертификаты", href: "/gift-certificates", hasSubmenu: true },
  { label: "Новинки", href: "/new" },
  { label: "Коллекции", href: "/collections", hasSubmenu: true },
];

export const catalogInfoLinks: CatalogInfoLink[] = [
  { label: "О бренде", href: "/about" },
  { label: "Новости", href: "/news" },
  { label: "Специальные предложения", href: "/offers" },
  { label: "Сотрудничество", href: "/partnership" },
];
