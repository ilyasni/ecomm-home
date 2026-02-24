/**
 * Seed-скрипт для наполнения Strapi контентом из мок-данных фронтенда.
 *
 * Запуск: npx ts-node --esm scripts/seed.ts
 * Требует: STRAPI_URL и STRAPI_ADMIN_TOKEN в переменных окружения.
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_ADMIN_TOKEN || process.env.STRAPI_API_TOKEN || "";

if (!TOKEN) {
  console.error("❌ Установи STRAPI_ADMIN_TOKEN или STRAPI_API_TOKEN");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function apiGet(path: string): Promise<unknown> {
  const res = await fetch(`${STRAPI_URL}/api${path}`, { headers });
  if (!res.ok) return null;
  return res.json();
}

async function apiPost(path: string, data: Record<string, unknown>): Promise<{ data: { documentId: string } }> {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`POST ${path} failed (${res.status}): ${error}`);
  }
  return res.json() as Promise<{ data: { documentId: string } }>;
}

async function apiPut(path: string, data: Record<string, unknown>) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`PUT ${path} failed (${res.status}): ${error}`);
  }
  return res.json();
}

async function upsertCollectionItem(
  pluralName: string,
  slugField: string,
  slugValue: string,
  data: Record<string, unknown>,
): Promise<string> {
  const existing = await apiGet(`/${pluralName}?filters[${slugField}][$eq]=${encodeURIComponent(slugValue)}`);
  const items = (existing as { data?: { documentId: string }[] })?.data;
  if (items && items.length > 0) {
    const docId = items[0].documentId;
    await apiPut(`/${pluralName}/${docId}`, data);
    return docId;
  }
  const res = await apiPost(`/${pluralName}`, data);
  return res.data.documentId;
}

// ─── Categories ────────────────────────────────────────────
async function seedCategories() {
  console.log("📂 Создаю категории...");
  const categories = [
    { title: "Постельное белье", slug: "bed-linen", icon: "catalogBedLinen", count: 205, isWide: true, sortOrder: 0 },
    { title: "Одеяла", slug: "blankets", icon: "catalogBlanket", count: 29, isWide: false, sortOrder: 1 },
    { title: "Подушки", slug: "pillows", icon: "catalogPillow", count: 44, isWide: false, sortOrder: 2 },
    { title: "Пледы", slug: "throws", icon: "catalogThrow", count: 24, isWide: false, sortOrder: 3 },
    { title: "Для дома", slug: "home", icon: "catalogHome", count: 83, isWide: false, sortOrder: 4 },
    { title: "Полотенца", slug: "towels", icon: "catalogTowel", count: 56, isWide: false, sortOrder: 5 },
    { title: "Будуарные наряды", slug: "boudoir", icon: "catalogBoudoir", count: 12, isWide: false, sortOrder: 6 },
  ];

  const created: Record<string, string> = {};
  for (const cat of categories) {
    const docId = await upsertCollectionItem("categories", "slug", cat.slug, cat);
    created[cat.slug] = docId;
    console.log(`  ✅ ${cat.title}`);
  }
  return created;
}

// ─── Products ──────────────────────────────────────────────
async function seedProducts(categoryIds: Record<string, string>) {
  console.log("🛍️ Создаю товары...");
  const products = [
    {
      title: "Комплект постельного белья Филигрань",
      slug: "filigran-bed-set",
      description: "Сатин, хлопок-батист, плотность класса 400 ТС",
      price: 13000,
      oldPrice: 19900,
      sku: "3829476",
      badge: "-15%",
      rating: 4.5,
      inStock: true,
      productType: "product",
      colors: [
        { name: "коричневый", hex: "#6B4C3B" },
        { name: "белый", hex: "#F5F0EB" },
        { name: "голубой", hex: "#B0C4DE" },
      ],
      category: categoryIds["bed-linen"],
    },
    {
      title: "Простыня на резинке Premium",
      slug: "premium-fitted-sheet",
      description: "Сатин, хлопок, плотность класса 300 ТС",
      price: 5000,
      oldPrice: 7500,
      sku: "3829477",
      badge: "-15%",
      rating: 4.5,
      inStock: true,
      productType: "product",
      colors: [
        { name: "белый", hex: "#F5F0EB" },
        { name: "серый", hex: "#A9A9A9" },
      ],
      category: categoryIds["bed-linen"],
    },
    {
      title: "Подушка пуховая Comfort",
      slug: "comfort-pillow",
      description: "Белый утиный пух в хлопке-батисте",
      price: 5000,
      sku: "3829478",
      rating: 4.0,
      inStock: true,
      productType: "product",
      colors: [{ name: "белый", hex: "#F5F0EB" }],
      category: categoryIds["pillows"],
    },
    {
      title: "Одеяло из шёлка Elegance",
      slug: "elegance-silk-blanket",
      description: "Натуральный шёлк, чехол из хлопка-батиста",
      price: 18000,
      oldPrice: 24000,
      sku: "3829479",
      badge: "Хит",
      rating: 5.0,
      inStock: true,
      productType: "product",
      category: categoryIds["blankets"],
    },
    {
      title: "Плед кашемировый Classic",
      slug: "classic-cashmere-throw",
      description: "100% кашемир, двусторонний",
      price: 15000,
      sku: "3829480",
      rating: 4.5,
      inStock: true,
      productType: "product",
      colors: [
        { name: "бежевый", hex: "#D2B48C" },
        { name: "серый", hex: "#808080" },
      ],
      category: categoryIds["throws"],
    },
    {
      title: "Подарочный сертификат",
      slug: "gift-certificate",
      subtitle: "Номинал на выбор",
      description: "Электронный сертификат на покупки в VITA BRAVA HOME",
      price: 5000,
      inStock: true,
      productType: "giftCertificate",
      giftCertDescription: "Сертификат действует 12 месяцев",
      sku: "GIFT-001",
    },
  ];

  const created: string[] = [];
  for (const product of products) {
    const { category, ...rest } = product;
    const payload: Record<string, unknown> = { ...rest };
    if (category) {
      payload.category = category;
    }
    const docId = await upsertCollectionItem("products", "slug", product.slug, payload);
    created.push(docId);
    console.log(`  ✅ ${product.title}`);
  }
  return created;
}

// ─── Collections ───────────────────────────────────────────
async function seedCollections() {
  console.log("📦 Создаю коллекции...");
  const collections = [
    {
      title: "Коллекция Light",
      slug: "light",
      heroTitle: "Light коллекция",
      heroSubtitle: "Коллекция Light — лёгкость и комфорт для вашего дома",
      descriptionTitle: "Коллекция Light — вдохновлённая свежестью утра",
      descriptionParagraphs: [
        "Коллекция Light создана для тех, кто ценит лёгкость и простоту.",
        "Натуральные материалы и нежные оттенки наполнят ваш дом уютом.",
      ],
      bannerTitle: "Какая подушка подойдет именно вам?",
      bannerDescription: "Пройдите короткий тест и мы подберём идеальный вариант",
      bannerButtonLabel: "Пройти тест",
      price: "от 10 000 ₽",
    },
    {
      title: "Коллекция Medium",
      slug: "medium",
      heroTitle: "Medium коллекция",
      heroSubtitle: "Коллекция Medium — идеальное решение для\nсовременного интерьера и комфортного сна",
      descriptionTitle: "Коллекция Medium — вдохновлённая спокойствием океана",
      descriptionParagraphs: [
        "Коллекция Medium — это баланс между комфортом и стилем.",
        "Каждое изделие создано с вниманием к деталям и качеству.",
      ],
      bannerTitle: "Какая подушка подойдет именно вам?",
      bannerDescription: "Пройдите короткий тест и мы подберём идеальный вариант",
      bannerButtonLabel: "Пройти тест",
      price: "от 15 000 ₽",
    },
    {
      title: "Коллекция Premium",
      slug: "premium",
      heroTitle: "Premium коллекция",
      heroSubtitle: "Коллекция Premium — эталон роскоши\nи безупречного качества",
      descriptionTitle: "Коллекция Premium — воплощение элегантности",
      descriptionParagraphs: [
        "Premium коллекция — для тех, кто не идёт на компромиссы.",
        "Лучшие материалы мира для вашего комфорта.",
      ],
      bannerTitle: "Какая подушка подойдет именно вам?",
      bannerDescription: "Пройдите короткий тест и мы подберём идеальный вариант",
      bannerButtonLabel: "Пройти тест",
      price: "от 25 000 ₽",
    },
  ];

  for (const coll of collections) {
    await upsertCollectionItem("collections", "slug", coll.slug, coll);
    console.log(`  ✅ ${coll.title}`);
  }
}

// ─── Articles ──────────────────────────────────────────────
async function seedArticles() {
  console.log("📰 Создаю статьи...");
  const articles = [
    {
      title: "Как подобрать полотенца",
      slug: "how-to-choose-towels",
      category: "идеи",
      date: "2025-07-08",
      excerpt: "Разбираемся, как выбрать идеальное полотенце для ванной, кухни и бани.",
    },
    {
      title: "Уход за постельным бельём из сатина",
      slug: "satin-bed-linen-care",
      category: "идеи",
      date: "2025-06-28",
      excerpt: "Практические советы по стирке, сушке и хранению сатинового белья.",
    },
    {
      title: "Новая коллекция Medium уже в продаже",
      slug: "medium-collection-launch",
      category: "новинки",
      date: "2025-07-01",
      excerpt: "Встречайте обновлённую коллекцию Medium с улучшенными материалами.",
    },
    {
      title: "VITA BRAVA HOME на выставке «Текстиль-2025»",
      slug: "textile-expo-2025",
      category: "новости",
      date: "2025-06-15",
      excerpt: "Наша команда представила новинки сезона на главной текстильной выставке страны.",
    },
  ];

  for (const article of articles) {
    await upsertCollectionItem("articles", "slug", article.slug, article);
    console.log(`  ✅ ${article.title}`);
  }
}

// ─── Boutiques ─────────────────────────────────────────────
async function seedBoutiques() {
  console.log("🏪 Создаю бутики...");
  const boutiques = [
    {
      name: "VITA BRAVA HOME Москва",
      city: "Москва",
      address: "Мясницкая 13 ст7, м. Чистые пруды, Тургеневская",
      metro: "м. Чистые пруды",
      metroDetail: "Тургеневская",
      schedule: "Пн-Вс",
      scheduleTime: "10:00 - 22:00",
      phone: "+7 926 000 35 92",
      email: "vahome@mail.ru",
      workingHours: "10:00 - 22:00",
    },
    {
      name: "VITA BRAVA HOME Краснодар",
      city: "Краснодар",
      address: "ул. Красная, 176, ТЦ OZ Mall, 2 этаж",
      schedule: "Пн-Вс",
      scheduleTime: "10:00 - 22:00",
      phone: "+7 926 000 35 93",
      email: "vahome-krd@mail.ru",
      workingHours: "10:00 - 22:00",
    },
    {
      name: "VITA BRAVA HOME Санкт-Петербург",
      city: "Санкт-Петербург",
      address: "Невский проспект, 114-116, ТРК Невский Центр, 3 этаж",
      metro: "м. Площадь Восстания",
      schedule: "Пн-Вс",
      scheduleTime: "10:00 - 22:00",
      phone: "+7 926 000 35 94",
      email: "vahome-spb@mail.ru",
      workingHours: "10:00 - 22:00",
    },
  ];

  for (const boutique of boutiques) {
    await upsertCollectionItem("boutiques", "name", boutique.name, boutique);
    console.log(`  ✅ ${boutique.name}`);
  }
}

// ─── Info Pages ────────────────────────────────────────────
async function seedInfoPages() {
  console.log("📄 Создаю информационные страницы...");
  const pages = [
    {
      title: "Политика в отношении обработки персональных данных",
      slug: "privacy",
      breadcrumbLabel: "Политика конфиденциальности",
      sections: [
        { title: "1. Общие положения", paragraphs: ["Настоящая политика определяет порядок обработки персональных данных пользователей."] },
        { title: "2. Цели обработки", paragraphs: ["Персональные данные обрабатываются в целях предоставления услуг и выполнения обязательств."] },
      ],
    },
    {
      title: "Условия продажи",
      slug: "terms",
      breadcrumbLabel: "Условия продажи",
      sections: [
        { title: "1. Предмет договора", paragraphs: ["Продавец обязуется передать покупателю товар надлежащего качества."] },
      ],
    },
    {
      title: "Согласие на обработку персональных данных",
      slug: "consent",
      breadcrumbLabel: "Согласие на обработку данных",
      sections: [
        { title: "Согласие", paragraphs: ["Настоящим я даю согласие на обработку своих персональных данных."] },
      ],
    },
  ];

  for (const page of pages) {
    await upsertCollectionItem("info-pages", "slug", page.slug, page);
    console.log(`  ✅ ${page.title}`);
  }
}

// ─── Home Page (Single Type) ───────────────────────────────
async function seedHomePage() {
  console.log("🏠 Настраиваю главную страницу...");
  await apiPut("/home-page", {
    heroSlides: [
      { title: "Постельное белье\nпремиум качества", subtitle: "Новые поступления осень-зима 2025", action: "Каталог" },
      { title: "Коллекция Medium", subtitle: "Идеальный баланс цены и качества", action: "Смотреть" },
      { title: "Подарочные сертификаты", subtitle: "Идеальный подарок для близких", action: "Выбрать" },
    ],
    budgetCollections: [
      { title: "Коллекция Light", price: "от 10 000 ₽" },
      { title: "Коллекция Medium", price: "от 15 000 ₽" },
      { title: "Коллекция Premium", price: "от 25 000 ₽" },
    ],
    advantages: [
      { title: "Идеальное соотношение цены и качества" },
      { title: "Большой выбор на любой бюджет" },
      { title: "Бесплатная доставка по всей России" },
    ],
    feedbacks: [
      { name: "Мария Иванова", city: "Москва", text: "Великолепное качество постельного белья! Очень мягкое и приятное к телу. Стираю уже несколько месяцев — как новое." },
      { name: "Елена Смирнова", city: "Санкт-Петербург", text: "Заказывала комплект в подарок маме. Она в полном восторге! Красивая упаковка, отличное качество ткани." },
      { name: "Анна Петрова", city: "Краснодар", text: "Покупаю не первый раз. Всегда отличное качество и быстрая доставка. Рекомендую всем!" },
    ],
  });
  console.log("  ✅ Главная страница");
}

// ─── About Page (Single Type) ──────────────────────────────
async function seedAboutPage() {
  console.log("ℹ️ Настраиваю страницу О бренде...");
  await apiPut("/about-page", {
    heroTitle: "VITA BRAVA HOME —\n10 лет на рынке\nтекстиля в России",
    introText: "Мы создаем текстиль премиального качества по доступным ценам. Наша миссия — сделать комфорт и роскошь доступными каждому.",
    introButtonLabel: "Подробнее о бренде",
    advantages: [
      { title: "Идеальное соотношение цены и качества" },
      { title: "Большой выбор на любой бюджет" },
      { title: "Бесплатная доставка по всей России" },
    ],
    historyTitle: "История бренда VITA BRAVA HOME",
    historyParagraphs: [
      "VITA BRAVA HOME был основан в 2015 году с простой идеей — создать текстиль премиального качества по доступным ценам.",
      "Сегодня мы предлагаем широкий ассортимент постельного белья, подушек, одеял и пледов из лучших материалов.",
    ],
    differenceTitle: "Что нас отличает",
    differenceItems: [
      { title: "Качество", subtitle: "Используем только натуральные материалы высшего качества" },
      { title: "Комфорт", subtitle: "Каждое изделие создано для максимального комфорта" },
      { title: "Доступность", subtitle: "Премиальное качество по справедливым ценам" },
    ],
    collectionsTitle: "Коллекции VITA BRAVA",
    collectionsSubtitle: "рассчитаны на разные бюджеты, но объединены качеством",
    collectionPreviews: [
      { title: "Коллекция Light" },
      { title: "Коллекция Medium" },
      { title: "Коллекция Premium" },
    ],
    productionTitle: "Поиск и выбор материала",
    productionSteps: [
      { title: "Исследование рынка", description: "Анализируем лучшие мировые фабрики тканей" },
      { title: "Тестирование тканей", description: "Проводим тесты на прочность, мягкость и долговечность" },
      { title: "Производство", description: "Контролируем каждый этап пошива" },
      { title: "Проверка", description: "Многоступенчатый контроль качества перед отправкой" },
    ],
    creatingTitle: "Создаем для вас",
    creatingBlocks: [
      { text: "Мы тщательно подбираем каждую ткань, каждую нить, чтобы создать изделия, которые будут радовать вас долгие годы.", imagePosition: "left" },
      { text: "Наши дизайнеры работают над каждой коллекцией с любовью и вниманием к деталям.", imagePosition: "right" },
    ],
  });
  console.log("  ✅ Страница О бренде");
}

// ─── Contacts Page (Single Type) ───────────────────────────
async function seedContactsPage() {
  console.log("📞 Настраиваю страницу Контакты...");
  await apiPut("/contacts-page", {
    phone: "+7 926 000 35 92",
    email: "vahome@mail.ru",
    socials: [
      { label: "ВКонтакте", href: "https://vk.com/vitabravahome" },
      { label: "Telegram", href: "https://t.me/vitabravahome" },
    ],
  });
  console.log("  ✅ Страница Контакты");
}

// ─── Cooperation Page (Single Type) ────────────────────────
async function seedCooperationPage() {
  console.log("🤝 Настраиваю страницу Сотрудничество...");
  await apiPut("/cooperation-page", {
    heroTitle: "Присоединяйтесь к клубу\nпартнёров Vita Brava Home",
    heroSubtitle: "Расширяйте ассортимент вашего магазина продукцией премиального качества",
    heroButtonLabel: "Стать партнёром",
    introText: "Мы предлагаем выгодные условия сотрудничества для оптовых и розничных партнёров.",
    partnerOfferItems: [
      { title: "Предоплата не нужна", description: "Начните продавать без стартовых вложений" },
      { title: "Покупательское обслуживание", description: "Полная поддержка ваших клиентов нашей командой" },
      { title: "Маркетинговая поддержка", description: "Предоставляем фото, описания и промо-материалы" },
      { title: "Гибкая система скидок", description: "Индивидуальные условия для каждого партнёра" },
    ],
    advantages: [
      { title: "Индивидуальный подход и поддержка" },
      { title: "Качество и премиальность" },
      { title: "Лояльность и привилегии" },
    ],
    partnershipFormTitle: "Программа VITA BRAVA HOME",
    partnershipFormSubtitle: "Заполните форму и мы свяжемся с вами в течение рабочего дня",
  });
  console.log("  ✅ Страница Сотрудничество");
}

// ─── Loyalty Page (Single Type) ────────────────────────────
async function seedLoyaltyPage() {
  console.log("🎁 Настраиваю страницу Программа лояльности...");
  await apiPut("/loyalty-page", {
    heroTitle: "Программа лояльности",
    heroDescription: "Накапливайте бонусы и получайте эксклюзивные предложения с каждой покупкой",
    heroButtonLabel: "Условия программы лояльности",
    steps: [
      { iconsCount: 1, title: "Авторизируйтесь\nна сайте", description: "Создайте аккаунт или войдите в существующий" },
      { iconsCount: 2, title: "Совершите\nпервую покупку", description: "Получите 500 приветственных бонусов" },
      { iconsCount: 3, title: "Накапливайте\nбонусы", description: "5% кэшбэк бонусами с каждой покупки" },
      { iconsCount: 4, title: "Оплачивайте\nбонусами", description: "До 50% стоимости заказа бонусами" },
    ],
    balanceCheck: {
      title: "Проверка баланса",
      description: "Узнайте количество бонусов на вашем счёте",
      buttonLabel: "В личный кабинет",
    },
    faq: [
      { question: "Как накопить бонусы?", answer: "Бонусы начисляются автоматически с каждой покупки — 5% от суммы заказа." },
      { question: "Как потратить бонусы?", answer: "Оплатите до 50% стоимости следующего заказа накопленными бонусами." },
      { question: "Срок действия бонусов?", answer: "Бонусы действительны в течение 12 месяцев с момента начисления." },
      { question: "Можно ли использовать бонусы вместе со скидкой?", answer: "Да, бонусы можно использовать в дополнение к действующим акциям." },
    ],
  });
  console.log("  ✅ Страница Программа лояльности");
}

// ─── Special Offers Page (Single Type) ─────────────────────
async function seedSpecialOffersPage() {
  console.log("🔥 Настраиваю страницу Спецпредложения...");
  await apiPut("/special-offers-page", {
    offers: [
      { title: "+50% кэшбека бонусами", subtitle: "При покупке от 10 000 ₽" },
      { title: "1+1 на подушки", subtitle: "Вторая подушка в подарок" },
      { title: "Бесплатная доставка", subtitle: "На все заказы от 5 000 ₽" },
      { title: "Скидка 20% новым клиентам", subtitle: "На первый заказ" },
    ],
    bonusSection: {
      title: "500 бонусов на счет и 5% кэшбэк для новых клиентов",
      description: "Зарегистрируйтесь и получите приветственные бонусы прямо сейчас",
      buttonLabel: "Зарегистрироваться",
    },
  });
  console.log("  ✅ Страница Спецпредложения");
}

// ─── Customer Info Page (Single Type) ──────────────────────
async function seedCustomerInfoPage() {
  console.log("📋 Настраиваю страницу Покупателям...");
  await apiPut("/customer-info-page", {
    categories: [
      {
        categoryId: "delivery",
        label: "Доставка",
        title: "Доставка",
        tabs: [
          { tabId: "moscow", label: "Москва" },
          { tabId: "mo", label: "Московская область" },
          { tabId: "regions", label: "Регионы" },
        ],
        cards: [
          {
            title: "Курьерская доставка",
            highlight: "Бесплатно от 5 000 ₽",
            paragraphs: ["Доставка курьером по Москве в течение 1-2 рабочих дней."],
          },
          {
            title: "Экспресс-доставка",
            highlight: "от 500 ₽",
            paragraphs: ["Доставка в день заказа при оформлении до 14:00."],
          },
        ],
      },
      {
        categoryId: "payment",
        label: "Оплата",
        title: "Оплата",
        cards: [
          {
            title: "Банковские карты",
            paragraphs: ["Принимаем Visa, MasterCard, МИР."],
          },
          {
            title: "Оплата при получении",
            paragraphs: ["Наличными или картой курьеру."],
          },
        ],
      },
      {
        categoryId: "returns",
        label: "Возврат",
        title: "Возврат",
        cards: [
          {
            title: "Возврат товара",
            paragraphs: ["Вы можете вернуть товар в течение 14 дней с момента получения."],
          },
        ],
      },
    ],
  });
  console.log("  ✅ Страница Покупателям");
}

// ─── Navigation (Single Type) ───────────────────────────────
async function seedNavigation() {
  console.log("🧭 Настраиваю навигацию...");
  await apiPut("/navigation", {
    topBarText: "Летние коллекции уже в наличии",
    phone: "8 800 888-80-80",
    telegramUrl: "https://t.me/vitabravahome",
    whatsappUrl: "https://wa.me/79260003592",
    topMenuItems: [
      { label: "О бренде", href: "/about", isHighlighted: false, openInNewTab: false },
      { label: "Новости", href: "/news", isHighlighted: false, openInNewTab: false },
      { label: "Специальные предложения", href: "/special-offers", isHighlighted: false, openInNewTab: false },
      { label: "Покупателям", href: "/customer-info", isHighlighted: false, openInNewTab: false },
      { label: "Сотрудничество", href: "/cooperation", isHighlighted: false, openInNewTab: false },
      { label: "Контакты", href: "/contacts", isHighlighted: false, openInNewTab: false },
      { label: "Бутики", href: "/contacts", isHighlighted: false, openInNewTab: false },
    ],
    catalogCategories: [
      {
        label: "Постельное белье", href: "/catalog/bed-linen", hasSubmenu: true,
        subcategories: [
          { label: "Комплекты", href: "/catalog/bed-linen/sets", isHighlighted: false, openInNewTab: false },
          { label: "Конструктор", href: "/catalog/bed-linen/constructor", isHighlighted: false, openInNewTab: false },
          { label: "Наволочки", href: "/catalog/bed-linen/pillowcases", isHighlighted: false, openInNewTab: false },
          { label: "Простыни", href: "/catalog/bed-linen/sheets", isHighlighted: false, openInNewTab: false },
          { label: "Пододеяльники", href: "/catalog/bed-linen/duvet-covers", isHighlighted: false, openInNewTab: false },
        ],
      },
      {
        label: "Домашний текстиль", href: "/catalog/home-textile", hasSubmenu: true,
        subcategories: [
          { label: "Скатерти", href: "/catalog/home-textile/tablecloths", isHighlighted: false, openInNewTab: false },
          { label: "Салфетки", href: "/catalog/home-textile/napkins", isHighlighted: false, openInNewTab: false },
          { label: "Дорожки", href: "/catalog/home-textile/runners", isHighlighted: false, openInNewTab: false },
        ],
      },
      { label: "Одеяла", href: "/catalog/blankets", hasSubmenu: false, subcategories: [] },
      { label: "Подушки", href: "/catalog/pillows", hasSubmenu: false, subcategories: [] },
      { label: "Пледы", href: "/catalog/plaids", hasSubmenu: false, subcategories: [] },
      { label: "Полотенца", href: "/catalog/towels", hasSubmenu: false, subcategories: [] },
      { label: "Будуарные наряды", href: "/catalog/boudoir", hasSubmenu: false, subcategories: [] },
      { label: "Подарочные сертификаты", href: "/catalog/gift-certificates", hasSubmenu: false, subcategories: [] },
    ],
  });
  console.log("  ✅ Навигация");
}

// ─── Footer (Single Type) ───────────────────────────────────
async function seedFooter() {
  console.log("🦶 Настраиваю футер...");
  await apiPut("/footer", {
    columns: [
      {
        title: "Каталог",
        links: [
          { label: "Постельное белье", href: "/catalog/bed-linen", isHighlighted: false, openInNewTab: false },
          { label: "Домашний текстиль", href: "/catalog/home-textile", isHighlighted: false, openInNewTab: false },
          { label: "Одеяла", href: "/catalog/blankets", isHighlighted: false, openInNewTab: false },
          { label: "Подушки", href: "/catalog/pillows", isHighlighted: false, openInNewTab: false },
          { label: "Пледы", href: "/catalog/plaids", isHighlighted: false, openInNewTab: false },
          { label: "Полотенца", href: "/catalog/towels", isHighlighted: false, openInNewTab: false },
          { label: "Будуарные наряды", href: "/catalog/boudoir", isHighlighted: false, openInNewTab: false },
          { label: "Подарочные сертификаты", href: "/catalog/gift-certificates", isHighlighted: false, openInNewTab: false },
        ],
      },
      {
        title: "Покупателям",
        links: [
          { label: "О компании", href: "/about", isHighlighted: false, openInNewTab: false },
          { label: "Контакты", href: "/contacts", isHighlighted: false, openInNewTab: false },
          { label: "Помощь", href: "/customer-info", isHighlighted: false, openInNewTab: false },
          { label: "Доставка, оплата и возврат", href: "/customer-info", isHighlighted: false, openInNewTab: false },
          { label: "Бутики", href: "/contacts", isHighlighted: false, openInNewTab: false },
          { label: "Блог/Новости", href: "/news", isHighlighted: false, openInNewTab: false },
        ],
      },
    ],
    bottomText: "© 2025 Vita Brava Home",
    phone: "+7 926 000 35 92",
    email: "vahome@mail.ru",
    socials: [
      { label: "vahome@mail.ru", href: "mailto:vahome@mail.ru", icon: "email" },
      { label: "+7 926 000 35 92", href: "tel:+79260003592", icon: "phone" },
      { label: "Instagram", href: "#", icon: "instagram" },
      { label: "ВКонтакте", href: "#", icon: "vk" },
      { label: "Telegram", href: "https://t.me/vitabravahome", icon: "telegram" },
    ],
  });
  console.log("  ✅ Футер");
}

// ─── Search Config (Single Type) ────────────────────────────
async function seedSearchConfig() {
  console.log("🔍 Настраиваю конфигурацию поиска...");
  await apiPut("/search-config", {
    popularQueries: [
      { label: "Постельное белье", href: "/catalog/bed-linen" },
      { label: "Сатин", href: "/catalog?fabric=satin" },
      { label: "Подушки", href: "/catalog/pillows" },
      { label: "Пледы", href: "/catalog/plaids" },
      { label: "Подарочный сертификат", href: "/catalog/gift-certificates" },
    ],
  });
  console.log("  ✅ Конфигурация поиска");
}

// ─── Home Page — новые блоки ─────────────────────────────────
async function seedHomePageExtended() {
  console.log("🏠 Обновляю главную страницу (расширенные блоки)...");
  await apiPut("/home-page", {
    heroSlides: [
      { title: "Постельное белье\nпремиум качества", subtitle: "Новые поступления осень-зима 2025", action: "Каталог" },
      { title: "Коллекция Medium", subtitle: "Идеальный баланс цены и качества", action: "Смотреть" },
      { title: "Подарочные сертификаты", subtitle: "Идеальный подарок для близких", action: "Выбрать" },
    ],
    budgetCollections: [
      { title: "Коллекция Light", price: "от 10 000 ₽" },
      { title: "Коллекция Medium", price: "от 15 000 ₽" },
      { title: "Коллекция Premium", price: "от 25 000 ₽" },
    ],
    advantages: [
      { title: "Идеальное соотношение цены и качества" },
      { title: "Большой выбор на любой бюджет" },
      { title: "Бесплатная доставка по всей России" },
    ],
    feedbacks: [
      { name: "Мария Иванова", city: "Москва", text: "Великолепное качество постельного белья! Очень мягкое и приятное к телу. Стираю уже несколько месяцев — как новое.", rating: 5, source: "yandex" },
      { name: "Елена Смирнова", city: "Санкт-Петербург", text: "Заказывала комплект в подарок маме. Она в полном восторге! Красивая упаковка, отличное качество ткани.", rating: 5, source: "google" },
      { name: "Анна Петрова", city: "Краснодар", text: "Покупаю не первый раз. Всегда отличное качество и быстрая доставка. Рекомендую всем!", rating: 5, source: "2gis" },
    ],
    certificateTitle: "Подарок, которому будет рад каждый",
    certificateText: "Хотите сделать приятный сюрприз для близкого, но не знаете, что выбрать? Наш подарочный сертификат позволит вам легко и быстро решить эту проблему.",
    certificateButtonLabel: "Выбрать сертификат",
    partnershipTitle: "Приглашаем\nк сотрудничеству",
    partnershipText: "Дизайнеров интерьеров, владельцев отелей, декораторов, хоумстейджеров и всех заинтересованных",
    partnershipButtonLabel: "Узнать условия",
    boutiqueTitle: "Посетите бутик\nVITA BRAVA HOME",
    featuredCategoryLabel: "Постельное бельё",
  });
  console.log("  ✅ Главная страница (расширенная)");
}

// ─── Publish ────────────────────────────────────────────────
async function publishViaContentManager(uid: string, documentId: string): Promise<boolean> {
  const res = await fetch(`${STRAPI_URL}/api/${uid}?status=published`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: {} }),
  });
  return res.ok;
}

async function publishSingleTypes() {
  console.log("📢 Публикую контент...");

  const singleTypes = [
    "navigation", "footer", "search-config",
    "home-page", "about-page", "contacts-page",
    "cooperation-page", "loyalty-page",
    "special-offers-page", "customer-info-page",
  ];

  for (const st of singleTypes) {
    try {
      const existing = await apiGet(`/${st}?status=draft`);
      const data = (existing as { data?: { documentId: string; publishedAt: string | null } })?.data;
      if (data && !data.publishedAt) {
        const ok = await publishViaContentManager(st, data.documentId);
        console.log(ok ? `  ✅ Опубликован: ${st}` : `  ⚠️  Не удалось: ${st}`);
      } else if (data?.publishedAt) {
        console.log(`  ⏭️  Уже опубликован: ${st}`);
      }
    } catch {
      console.log(`  ⚠️  Не удалось опубликовать: ${st}`);
    }
  }

  const collectionTypes = [
    "categories", "products", "collections", "articles", "boutiques", "info-pages",
  ];

  for (const ct of collectionTypes) {
    try {
      const existing = await apiGet(`/${ct}?status=draft&pagination[pageSize]=100`);
      const items = (existing as { data?: { documentId: string; publishedAt: string | null }[] })?.data;
      if (!items) continue;
      const drafts = items.filter((i) => !i.publishedAt);
      let published = 0;
      for (const item of drafts) {
        const ok = await publishViaContentManager(`${ct}/${item.documentId}`, item.documentId);
        if (ok) published++;
      }
      if (published > 0) {
        console.log(`  ✅ Опубликовано ${published} записей: ${ct}`);
      } else {
        console.log(`  ⏭️  Всё опубликовано: ${ct}`);
      }
    } catch {
      console.log(`  ⚠️  Не удалось опубликовать: ${ct}`);
    }
  }
}

// ─── Main ──────────────────────────────────────────────────
async function main() {
  console.log("🚀 Запускаю seed-скрипт...\n");

  try {
    const categoryIds = await seedCategories();
    await seedProducts(categoryIds);
    await seedCollections();
    await seedArticles();
    await seedBoutiques();
    await seedInfoPages();
    await seedAboutPage();
    await seedContactsPage();
    await seedCooperationPage();
    await seedLoyaltyPage();
    await seedSpecialOffersPage();
    await seedCustomerInfoPage();
    await seedNavigation();
    await seedFooter();
    await seedSearchConfig();
    await seedHomePageExtended();

    await publishSingleTypes();

    console.log("\n✅ Seed завершён успешно!");
  } catch (error) {
    console.error("\n❌ Ошибка:", error);
    process.exit(1);
  }
}

main();
