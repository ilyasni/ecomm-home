export type SpecialOffer = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

export const specialOffers: SpecialOffer[] = [
  {
    id: "offer-1",
    title: "+50% кэшбека бонусами",
    subtitle: "При покупке постельного белья из коллекции Premium",
    image: "/assets/figma/special-offers/offer-1.jpg",
  },
  {
    id: "offer-2",
    title: "Премиальный комфорт",
    subtitle: "До -20% на более 50 моделей",
    image: "/assets/figma/special-offers/offer-2.jpg",
  },
  {
    id: "offer-3",
    title: "Акция «Конструктора»",
    subtitle: "Собери свой комплект со скидкой до 30%",
    image: "/assets/figma/special-offers/offer-3.jpg",
  },
  {
    id: "offer-4",
    title: "Декоративные подушки в подарок",
    subtitle: "При покупке постельного белья с 30 ноября по 30 декабря",
    image: "/assets/figma/special-offers/offer-4.jpg",
  },
  {
    id: "offer-5",
    title: "Снижение цен на весеннюю коллекцию Glamour",
    subtitle: "Премиум-качество по выгодной цене",
    image: "/assets/figma/special-offers/offer-5.jpg",
  },
  {
    id: "offer-6",
    title: "Подарок, который ждут!",
    subtitle: "Подарочный сертификат в электронном варианте",
    image: "/assets/figma/special-offers/offer-6.jpg",
  },
];

export const bonusSection = {
  title: "500 бонусов на счет и 5% кэшбэк для новых клиентов",
  description:
    "Зарегистрируйтесь на сайте перед покупкой и получите 5% от суммы заказа баллами на свой бонусный счёт, а также 500 приветственных бонусов, которыми вы сможете оплатить до 20% стоимости покупки",
  buttonLabel: "Зарегистрироваться",
  image: "/assets/figma/special-offers/bonus.jpg",
};

export const newsSlider = [
  {
    id: "news-1",
    label: "Эксклюзив",
    date: "2 дня назад",
    title: "Одеяла и подушки с кукурузным волокном",
    text: "Почувствуйте себя в отеле 5 звезд, не выходя из дома!",
    image: "/assets/figma/news/news-1.jpg",
  },
  {
    id: "news-2",
    label: "Ткани",
    date: "4 дня назад",
    title: "Сатин: что это за ткань и в чем ее преимущество",
    text: "Постельное белье из сатина — прекрасный выбор для тех, кто ценит комфортный сон.",
    image: "/assets/figma/news/news-1.jpg",
  },
  {
    id: "news-3",
    label: "Новинки",
    date: "2 дня назад",
    title: "Одеяла и подушки с кукурузным волокном",
    text: "Почувствуйте себя в отеле 5 звезд, не выходя из дома!",
    image: "/assets/figma/news/news-1.jpg",
  },
  {
    id: "news-4",
    label: "Ткани",
    date: "4 дня назад",
    title: "Сатин: что это за ткань и в чем ее преимущество",
    text: "Постельное белье из сатина — прекрасный выбор для тех, кто ценит комфортный сон.",
    image: "/assets/figma/news/news-1.jpg",
  },
];
