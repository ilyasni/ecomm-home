export interface AccountUser {
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  phone: string;
  birthDate: string;
  bonuses: number;
  city: string;
  region: string;
}

export interface BonusOperation {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface OrderProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  oldPrice?: string;
  image: string;
  badge?: string;
  colors?: { name: string; hex: string }[];
}

export interface Order {
  id: string;
  number: string;
  status: "Получен" | "Отменён" | "В доставке" | "Обработка";
  date: string;
  deliveryType: string;
  deliveryAddress: string;
  deliveryDate: string;
  paymentMethod: string;
  total: string;
  products: OrderProduct[];
}

export interface Address {
  id: string;
  label: string;
  region: string;
  city: string;
  street: string;
  isPrimary: boolean;
}

export interface NotificationSetting {
  id: string;
  label: string;
  email: boolean;
  sms: boolean;
}

export const accountUser: AccountUser = {
  firstName: "Анна",
  lastName: "Пакулева",
  initials: "АП",
  email: "anna@mail.ru",
  phone: "+7 999 999 99 99",
  birthDate: "12.01.1964",
  bonuses: 500,
  city: "г. Москва",
  region: "Московская область",
};

export const bonusOperations: BonusOperation[] = [
  { id: "bo-1", date: "11 июня 2025", description: "Списание бонусов за заказ №22098", amount: -50 },
  { id: "bo-2", date: "10 июня 2025", description: "Начисление за заказ №34567", amount: 100 },
  { id: "bo-3", date: "5 июня 2025", description: "Начисление за заказ №34567", amount: 100 },
  { id: "bo-4", date: "5 июня 2025", description: "Подписка на рассылку", amount: 100 },
];

const orderProducts: OrderProduct[] = [
  {
    id: "op-1",
    title: "Комплект постельного белья Петербург",
    description: "Белый утиный пух в хлопке-батисте",
    price: "23 800 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
    colors: [{ name: "бежевый", hex: "#D4C5B0" }, { name: "белый", hex: "#F5F0EB" }],
  },
  {
    id: "op-2",
    title: "Комплект постельного белья Арии Минк",
    description: "Белый утиный пух в хлопке-батисте",
    price: "23 800 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
  },
  {
    id: "op-3",
    title: "Комплект постельного белья Петербург",
    description: "Белый утиный пух в хлопке-батисте",
    price: "23 800 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
  },
  {
    id: "op-4",
    title: "Комплект постельного белья Петербург",
    description: "Белый утиный пух в хлопке-батисте",
    price: "23 800 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
  },
];

export const orders: Order[] = [
  {
    id: "order-1",
    number: "513962004",
    status: "Получен",
    date: "17 августа в 18:00",
    deliveryType: "Доставка в пункт выдачи",
    deliveryAddress: "Пункт СДЭК, Россия, Тверская Область, Тверь, бульвар Радищева, 40",
    deliveryDate: "17 августа в 18:00",
    paymentMethod: "оплачено картой",
    total: "78 325 ₽",
    products: orderProducts,
  },
  {
    id: "order-2",
    number: "513962004",
    status: "Отменён",
    date: "17 августа в 18:00",
    deliveryType: "Доставка в пункт выдачи",
    deliveryAddress: "Пункт СДЭК, Россия, Тверская Область, Тверь, бульвар Радищева, 40",
    deliveryDate: "17 августа в 18:00",
    paymentMethod: "оплачено картой",
    total: "78 325 ₽",
    products: orderProducts.slice(0, 3),
  },
  {
    id: "order-3",
    number: "513962004",
    status: "Получен",
    date: "17 августа в 18:00",
    deliveryType: "Доставка в пункт выдачи",
    deliveryAddress: "Пункт СДЭК, Россия, Тверская Область, Тверь, бульвар Радищева, 40",
    deliveryDate: "17 августа в 18:00",
    paymentMethod: "оплачено картой",
    total: "78 325 ₽",
    products: orderProducts.slice(0, 2),
  },
  {
    id: "order-4",
    number: "513962004",
    status: "Получен",
    date: "17 августа в 18:00",
    deliveryType: "Доставка в пункт выдачи",
    deliveryAddress: "Пункт СДЭК, Россия, Тверская Область, Тверь, бульвар Радищева, 40",
    deliveryDate: "17 августа в 18:00",
    paymentMethod: "оплачено картой",
    total: "78 325 ₽",
    products: orderProducts,
  },
];

export const addresses: Address[] = [
  {
    id: "addr-1",
    label: "Адрес доставки основной",
    region: "Московская область",
    city: "г. Москва",
    street: "ул. Ленина, д. 121, кв. 15",
    isPrimary: true,
  },
];

export const notificationSettings: NotificationSetting[] = [
  { id: "ns-1", label: "Уведомления об изменении статуса заказа", email: false, sms: true },
  { id: "ns-2", label: "Напоминание", email: false, sms: true },
  { id: "ns-3", label: "Новостные рассылки, акции и скидки", email: true, sms: false },
  { id: "ns-4", label: "Всплывающие уведомления", email: false, sms: true },
];

export const promotionProducts: OrderProduct[] = [
  {
    id: "promo-1",
    title: "Комплект постельного белья Петербург",
    description: "Белый утиный пух в хлопке-батисте",
    price: "23 800 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
  },
  {
    id: "promo-2",
    title: "Комплект постельного белья Арии Минк",
    description: "Белый утиный пух в хлопке-батисте",
    price: "23 800 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
  },
  {
    id: "promo-3",
    title: "Комплект постельного белья Петербург",
    description: "Белый утиный пух в хлопке-батисте",
    price: "23 800 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
  },
  {
    id: "promo-4",
    title: "Комплект постельного белья Филигрань",
    description: "Сатин, хлопок-батист",
    price: "23 800 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
  },
  {
    id: "promo-5",
    title: "Комплект постельного белья Петербург",
    description: "Белый утиный пух в хлопке-батисте",
    price: "23 800 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
  },
  {
    id: "promo-6",
    title: "Комплект постельного белья Арии Минк",
    description: "Белый утиный пух в хлопке-батисте",
    price: "23 800 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
  },
];

export interface CartItem {
  id: string;
  title: string;
  description: string;
  size?: string;
  color: string;
  price: string;
  oldPrice?: string;
  total: string;
  image: string;
  quantity: number;
  bonusReturn: number;
  isFavorite: boolean;
}

export const cartItems: CartItem[] = [
  {
    id: "cart-1",
    title: "Комплект постельного белья Петербург",
    description: "Двуспальный евро (200x210 см)",
    color: "Бежевый",
    price: "15 000 ₽",
    oldPrice: "16 000 ₽",
    total: "15 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    quantity: 1,
    bonusReturn: 0,
    isFavorite: false,
  },
  {
    id: "cart-2",
    title: "Комплект: Пеньюар + сорочка длинной пух из шелковистой атласной ткани",
    description: "Размер 42 RUS",
    color: "Белый",
    price: "15 000 ₽",
    oldPrice: "16 000 ₽",
    total: "30 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    quantity: 2,
    bonusReturn: 60,
    isFavorite: true,
  },
  {
    id: "cart-3",
    title: "Комплект постельного белья Петербург",
    description: "Двуспальный евро (200x210 см)",
    color: "Бежевый",
    price: "15 000 ₽",
    oldPrice: "16 000 ₽",
    total: "15 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    quantity: 1,
    bonusReturn: 30,
    isFavorite: true,
  },
];

export const recentlyViewed = [
  {
    id: "rv-1",
    title: "Комплект постельного белья Сатин PETROL",
    description: "Белый утиный пух в хлопке-батисте",
    price: "5 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "Эксклюзив",
  },
  {
    id: "rv-2",
    title: "Микро гель подушка",
    description: "Поверхность Super Soft",
    price: "5 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "Эксклюзив",
  },
  {
    id: "rv-3",
    title: "Пуховая подушка",
    description: "Белый утиный пух в хлопке-батисте",
    price: "5 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "Эксклюзив",
  },
  {
    id: "rv-4",
    title: "Микро гель подушка",
    description: "Поверхность Super Soft",
    price: "5 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "Эксклюзив",
  },
];

export const favoriteProducts = [
  {
    id: "fav-1",
    title: "Комплект постельного белья Петербург",
    description: "полотняно серый с чёрным, хлопок-сатин 400 ТС",
    price: "23 800 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
    colors: [{ name: "бежевый", hex: "#D4C5B0" }, { name: "белый", hex: "#F5F0EB" }],
  },
  {
    id: "fav-2",
    title: "Комплект постельного белья Петербург",
    description: "оттенок жёлтого золота, египетский хлопок 400 ТС",
    price: "от 25 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
    colors: [{ name: "золотой", hex: "#BDA06A" }, { name: "белый", hex: "#F5F0EB" }, { name: "голубой", hex: "#B0C4DE" }],
  },
  {
    id: "fav-3",
    title: "Комплект постельного белья Арии Минк",
    description: "бежевый с белым и серо-голубым, Ринг сатин 220 ТС",
    price: "24 000 ₽",
    oldPrice: "61 050 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
  },
  {
    id: "fav-4",
    title: "Комплект постельного белья Фелинита",
    description: "Белый с золотистым и оттенком светлого серебра, аквамарин волнами SENSOTEX® 400 ТС",
    price: "15 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "Новинка",
  },
  {
    id: "fav-5",
    title: "Комплект постельного белья Петербург",
    description: "Белый с золотистым и серебристо-серым, хлопок-сатин 400 ТС",
    price: "45 000 ₽",
    oldPrice: "67 350 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
  },
];

// --- Checkout types & data ---

export interface DeliveryCity {
  id: string;
  name: string;
  region: string;
}

export interface Boutique {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  workingHours: string;
}

export type PaymentMethodType = "card" | "certificate" | "on-delivery";
export type DeliveryMethodType = "courier" | "pickup" | "cdek";

export interface PaymentMethod {
  id: PaymentMethodType;
  label: string;
  description?: string;
}

export interface DeliveryMethod {
  id: DeliveryMethodType;
  label: string;
  price: string;
  duration: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isLegalEntity: boolean;
  companyName: string;
  inn: string;
  kpp: string;
  paymentMethod: PaymentMethodType;
  deliveryMethod: DeliveryMethodType;
  deliveryCity: string;
  deliveryAddress: string;
  boutiqueId: string;
  promoCode: string;
  bonusesToSpend: number;
  comment: string;
}

export interface SuccessOrderData {
  orderNumber: string;
  total: string;
  paymentLabel: string;
  status: string;
  statusDescription: string;
  deliveryAddress: string;
  deliveryDate: string;
  recipient: string;
  recipientPhone: string;
  products: { id: string; title: string; image: string; quantity: number }[];
}

export const deliveryCities: DeliveryCity[] = [
  { id: "msk", name: "Москва", region: "Московская область" },
  { id: "spb", name: "Санкт-Петербург", region: "Ленинградская область" },
  { id: "tvr", name: "Тверь", region: "Тверская область" },
  { id: "kzn", name: "Казань", region: "Республика Татарстан" },
  { id: "nsk", name: "Новосибирск", region: "Новосибирская область" },
  { id: "ekb", name: "Екатеринбург", region: "Свердловская область" },
];

export const boutiques: Boutique[] = [
  {
    id: "bt-1",
    name: "Бутик Vita Brava Home на Петровке",
    address: "ул. Петровка, д. 5, ТЦ «Петровский Пассаж», 2 этаж",
    city: "Москва",
    phone: "+7 (495) 123-45-67",
    workingHours: "Пн–Вс: 10:00 – 22:00",
  },
  {
    id: "bt-2",
    name: "Бутик Vita Brava Home на Кутузовском",
    address: "Кутузовский пр., д. 48, 1 этаж",
    city: "Москва",
    phone: "+7 (495) 987-65-43",
    workingHours: "Пн–Вс: 10:00 – 21:00",
  },
  {
    id: "bt-3",
    name: "Бутик Vita Brava Home на Невском",
    address: "Невский пр., д. 114–116, ТГ «Невский Центр», 3 этаж",
    city: "Санкт-Петербург",
    phone: "+7 (812) 456-78-90",
    workingHours: "Пн–Вс: 10:00 – 22:00",
  },
];

export const paymentMethods: PaymentMethod[] = [
  { id: "card", label: "Оплата картой онлайн", description: "Visa, MasterCard, МИР" },
  { id: "certificate", label: "Подарочный сертификат" },
  { id: "on-delivery", label: "Оплата при получении", description: "Наличными или картой" },
];

export const deliveryMethods: DeliveryMethod[] = [
  { id: "courier", label: "Курьерская доставка", price: "590 ₽", duration: "1–3 дня" },
  { id: "pickup", label: "Самовывоз из бутика", price: "Бесплатно", duration: "Сегодня" },
  { id: "cdek", label: "Доставка в пункт выдачи СДЭК", price: "390 ₽", duration: "3–5 дней" },
];

export const successOrderMock: SuccessOrderData = {
  orderNumber: "3456",
  total: "60 400 ₽",
  paymentLabel: "Наличными или картой при получении",
  status: "Заказ №3456 поступил в обработку",
  statusDescription: "Ваш заказ принят и отправлен на сборку, дождитесь уведомления о готовности заказа.",
  deliveryAddress: "Россия, Московская область, г. Москва, ул. Ленина, д. 121, кв. 15",
  deliveryDate: "25 августа в 12:00–18:00",
  recipient: "Анна Пакулева",
  recipientPhone: "+7 999 999 99 99",
  products: [
    { id: "sp-1", title: "Комплект постельного белья Петербург", image: "/assets/figma/collections/featured.jpg", quantity: 1 },
    { id: "sp-2", title: "Комплект: Пеньюар + сорочка", image: "/assets/figma/collections/featured.jpg", quantity: 2 },
    { id: "sp-3", title: "Комплект постельного белья Арии Минк", image: "/assets/figma/collections/featured.jpg", quantity: 1 },
  ],
};

export const recommendedProducts: OrderProduct[] = [
  {
    id: "rec-1",
    title: "Комплект постельного белья Сатин PETROL",
    description: "Белый утиный пух в хлопке-батисте",
    price: "23 800 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
  },
  {
    id: "rec-2",
    title: "Микро гель подушка",
    description: "Поверхность Super Soft",
    price: "5 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "Эксклюзив",
  },
  {
    id: "rec-3",
    title: "Пуховая подушка",
    description: "Белый утиный пух в хлопке-батисте",
    price: "5 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "Новинка",
  },
  {
    id: "rec-4",
    title: "Комплект постельного белья Арии Минк",
    description: "Сатин, хлопок-батист",
    price: "24 000 ₽",
    oldPrice: "28 000 ₽",
    image: "/assets/figma/collections/featured.jpg",
    badge: "-15%",
  },
];

export const sidebarNavigation = {
  personalInfo: {
    title: "Личная информация",
    items: [
      { label: "Главная", href: "/account" },
      { label: "Программа лояльности", href: "/account/loyalty" },
      { label: "Адресная книга", href: "/account/address" },
    ],
  },
  orders: {
    title: "Заказы",
    items: [
      { label: "Заказы", href: "/account/orders" },
      { label: "Корзина", href: "/cart" },
    ],
  },
  subscriptions: {
    title: "Подписки",
    items: [
      { label: "Избранное", href: "/favorites" },
      { label: "Настройка уведомлений", href: "/account/notifications" },
    ],
  },
  promotions: {
    title: "Актуальные акции",
    items: [
      { label: "Акция «Баллы за отзывы»", href: "/account/promotions" },
    ],
  },
};
