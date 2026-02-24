/**
 * Заполнение недостающего контента в Strapi:
 * - тело статей (sections, toc)
 * - SEO для категорий и продуктов
 * - hitTabs, promoBannerItems
 * - спецификации продуктов (sizes, specifications, weight, composition, careInstructions)
 * - footer.socials icons
 * - contacts.socials icons
 */

const STRAPI_URL = "http://localhost:1337";
const TOKEN = "445c30fec01628915203e6620693e58679803465cc39de150d7482800760feb193d64d83a4655b5fb94cfffe2949fe74b5fe8c3eb08f7f13d3227f961d9140ce240b47b2842193c17776cc2bfbb2fb82f882d383bbc9d404c0e81b4fa780fc322d6a3b9e8d27dabcf5fc732c32273274d2a41975c565b475688964360a946c58";
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

async function get(path, params = {}) {
  const url = new URL(`/api/${path}`, STRAPI_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${TOKEN}` } });
  return res.ok ? res.json() : null;
}

async function put(path, data) {
  const res = await fetch(`${STRAPI_URL}/api/${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  ✗ ${path}: ${text.slice(0, 300)}`);
    return null;
  }
  console.log(`  ✓ ${path}`);
  return res.json();
}

async function main() {
  console.log("\n═══ Fill Missing Content ═══\n");

  // --- 1. Articles: add body sections and toc ---
  console.log("1. Articles...");
  const articles = await get("articles", { "pagination[pageSize]": "10", "populate": "*" });
  if (articles?.data) {
    const articleContents = [
      {
        slug: "kak-vybrat-postelnoe-bele",
        toc: [
          { title: "Выбор ткани", anchor: "fabric" },
          { title: "Размеры", anchor: "sizes" },
          { title: "Уход за бельём", anchor: "care" },
        ],
        sections: [
          {
            title: "Выбор ткани",
            anchor: "fabric",
            content: "Качественное постельное бельё начинается с правильного выбора ткани. Сатин — гладкая и плотная ткань с шелковистым блеском. Бязь — прочная и доступная. Батист — тонкая и нежная ткань для тех, кто ценит мягкость. Плотность ткани измеряется в TC (Thread Count): от 200 TC — базовое качество, 300-400 TC — премиум, 500+ TC — люкс.",
          },
          {
            title: "Размеры",
            anchor: "sizes",
            content: "Стандартные размеры постельного белья в России: полутороспальное (150×210 см), двуспальное (175×210 см), евро (200×220 см), семейное (два пододеяльника 150×210 см). Перед покупкой измерьте матрас и подушки — белье должно сидеть свободно, но без избытка ткани.",
          },
          {
            title: "Уход за бельём",
            anchor: "care",
            content: "Стирайте при температуре не выше 40°C с мягким моющим средством. Не используйте отбеливатели. Сушите на воздухе, избегая прямых солнечных лучей. Гладьте при средней температуре. Сатин не требует глажки, если сушить его в расправленном виде.",
          },
        ],
      },
      {
        slug: "trendy-domashnego-tekstilya",
        toc: [
          { title: "Натуральные материалы", anchor: "natural" },
          { title: "Цветовые тренды", anchor: "colors" },
        ],
        sections: [
          {
            title: "Натуральные материалы",
            anchor: "natural",
            content: "В 2025–2026 году тренд на устойчивое развитие продолжает влиять на индустрию домашнего текстиля. Покупатели выбирают органический хлопок, лён, бамбуковое волокно и тенсель. Эти материалы экологичны, гипоаллергенны и обеспечивают комфортный сон. VITA BRAVA HOME использует сертифицированные ткани OEKO-TEX Standard 100.",
          },
          {
            title: "Цветовые тренды",
            anchor: "colors",
            content: "Актуальная палитра: приглушённые земляные тона (терракота, охра, оливковый), нежные пастельные оттенки (лавандовый, пыльная роза, мятный), а также классические нейтральные — белый, кремовый и серый. Геометрические принты уступают место флоральным мотивам и абстрактным узорам.",
          },
        ],
      },
      {
        slug: "uhod-za-shelkovymi-izdeliyami",
        toc: [
          { title: "Стирка", anchor: "washing" },
          { title: "Хранение", anchor: "storage" },
        ],
        sections: [
          {
            title: "Стирка",
            anchor: "washing",
            content: "Шёлк требует бережного ухода. Стирайте вручную или в режиме деликатной стирки при температуре не выше 30°C. Используйте специальное средство для шёлка или мягкий шампунь. Не выкручивайте изделие — аккуратно отожмите через полотенце.",
          },
          {
            title: "Хранение",
            anchor: "storage",
            content: "Храните шёлковые изделия в тканевых чехлах, избегая пластиковых пакетов — ткань должна «дышать». Используйте лаванду или кедровые шарики для защиты от моли. Не складывайте шёлк надолго — лучше вешать на плечики.",
          },
        ],
      },
      {
        slug: "podarki-dlya-doma",
        toc: [
          { title: "Идеи подарков", anchor: "ideas" },
          { title: "Подарочные сертификаты", anchor: "certificates" },
        ],
        sections: [
          {
            title: "Идеи подарков",
            anchor: "ideas",
            content: "Домашний текстиль — универсальный подарок для любого повода. Комплект премиального постельного белья подойдёт на новоселье. Кашемировый плед — отличный подарок на день рождения. Набор банных полотенец — практичный и стильный подарок. Будуарный комплект — романтический подарок для особого случая.",
          },
          {
            title: "Подарочные сертификаты",
            anchor: "certificates",
            content: "Если вы не уверены в выборе, подарочный сертификат VITA BRAVA HOME — идеальное решение. Доступны номиналы от 3 000 до 50 000 ₽. Сертификат действует 12 месяцев и может быть использован в любом бутике или интернет-магазине.",
          },
        ],
      },
    ];

    for (const art of articles.data) {
      const content = articleContents.find((c) => c.slug === art.slug);
      if (content) {
        await put(`articles/${art.documentId}`, {
          toc: content.toc,
          sections: content.sections,
        });
      }
    }
  }

  // --- 2. Products: SEO, specifications ---
  console.log("\n2. Products: SEO + specs...");
  const products = await get("products", { "pagination[pageSize]": "20" });
  if (products?.data) {
    const productDetails = {
      "filigran-bed-set": {
        seoTitle: "КПБ Филигрань — купить постельное бельё премиум | VITA BRAVA HOME",
        seoDescription: "Комплект постельного белья Филигрань из сатина высшего качества. Плотность 400 TC. Доставка по России.",
        weight: "2.8 кг",
        composition: "100% хлопок (сатин), плотность 400 TC",
        careInstructions: "Стирка при 40°C, не отбеливать, гладить при средней температуре",
        sizes: [
          { label: "Евро", value: "200×220 см" },
          { label: "Семейный", value: "2×150×210 см" },
        ],
        specifications: [
          { label: "Материал", value: "Сатин" },
          { label: "Состав", value: "100% хлопок" },
          { label: "Плотность", value: "400 TC" },
          { label: "Страна", value: "Россия" },
        ],
      },
      "premium-fitted-sheet": {
        seoTitle: "Простыня на резинке Premium — купить | VITA BRAVA HOME",
        seoDescription: "Простыня на резинке Premium из сатина 300 TC. Плотная посадка, идеально держится на матрасе.",
        weight: "0.9 кг",
        composition: "100% хлопок (сатин), плотность 300 TC",
        careInstructions: "Стирка при 40°C, не отбеливать, сушка в расправленном виде",
        sizes: [
          { label: "160×200 см", value: "высота 30 см" },
          { label: "180×200 см", value: "высота 30 см" },
        ],
        specifications: [
          { label: "Материал", value: "Сатин" },
          { label: "Состав", value: "100% хлопок" },
          { label: "Плотность", value: "300 TC" },
          { label: "Резинка", value: "по всему периметру" },
        ],
      },
      "comfort-pillow": {
        seoTitle: "Подушка пуховая Comfort — купить | VITA BRAVA HOME",
        seoDescription: "Подушка с наполнителем из белого утиного пуха в чехле из хлопка-батиста. Мягкая и гипоаллергенная.",
        weight: "1.2 кг",
        composition: "Наполнитель: 90% пух, 10% перо. Чехол: 100% хлопок (батист)",
        careInstructions: "Химчистка или деликатная стирка при 30°C, сушить в горизонтальном положении",
        sizes: [
          { label: "50×70 см", value: "стандарт" },
          { label: "70×70 см", value: "евро" },
        ],
        specifications: [
          { label: "Наполнитель", value: "Белый утиный пух 90/10" },
          { label: "Чехол", value: "Хлопок-батист" },
          { label: "Упругость", value: "Средняя" },
          { label: "Гипоаллергенно", value: "Да" },
        ],
      },
      "elegance-silk-blanket": {
        seoTitle: "Одеяло из шёлка Elegance — купить | VITA BRAVA HOME",
        seoDescription: "Шёлковое одеяло Elegance с наполнителем из натурального шёлка Mulberry. Лёгкое, терморегулирующее.",
        weight: "2.0 кг",
        composition: "Наполнитель: 100% шёлк Mulberry. Чехол: 100% хлопок (батист)",
        careInstructions: "Только химчистка. Проветривать на свежем воздухе.",
        sizes: [
          { label: "200×220 см", value: "евро" },
          { label: "150×210 см", value: "полуторное" },
        ],
        specifications: [
          { label: "Наполнитель", value: "Шёлк Mulberry" },
          { label: "Чехол", value: "Хлопок-батист" },
          { label: "Плотность наполнителя", value: "300 г/м²" },
          { label: "Всесезонное", value: "Да" },
        ],
      },
      "classic-cashmere-throw": {
        seoTitle: "Плед кашемировый Classic — купить | VITA BRAVA HOME",
        seoDescription: "Кашемировый плед Classic — мягкость и тепло натурального кашемира. Идеален для гостиной и спальни.",
        weight: "1.5 кг",
        composition: "100% кашемир",
        careInstructions: "Химчистка. Хранить в тканевом чехле. Не гладить.",
        sizes: [
          { label: "130×180 см", value: "стандарт" },
        ],
        specifications: [
          { label: "Материал", value: "Кашемир" },
          { label: "Состав", value: "100% кашемир" },
          { label: "Бахрома", value: "Да" },
          { label: "Страна", value: "Россия" },
        ],
      },
      "gift-certificate": {
        seoTitle: "Подарочный сертификат VITA BRAVA HOME",
        seoDescription: "Подарочный сертификат VITA BRAVA HOME — идеальный подарок. Номиналы от 3 000 до 50 000 ₽.",
        subtitle: "Подарок, которому будет рад каждый",
        giftCertDescription: "Подарочный сертификат VITA BRAVA HOME можно использовать в бутиках и интернет-магазине. Срок действия — 12 месяцев.",
        specifications: [
          { label: "Номинал", value: "3 000 — 50 000 ₽" },
          { label: "Срок действия", value: "12 месяцев" },
          { label: "Где использовать", value: "Бутики и интернет-магазин" },
        ],
      },
    };

    for (const prod of products.data) {
      const details = productDetails[prod.slug];
      if (details) {
        await put(`products/${prod.documentId}`, details);
      }
    }
  }

  // --- 3. Categories: SEO ---
  console.log("\n3. Categories: SEO...");
  const cats = await get("categories", { "pagination[pageSize]": "20" });
  if (cats?.data) {
    const catSeo = {
      "bed-linen": {
        seoTitle: "Постельное бельё премиум-класса — каталог | VITA BRAVA HOME",
        seoDescription: "Комплекты постельного белья из сатина, батиста и жаккарда. Плотность до 400+ TC. Бесплатная доставка по Москве.",
        seoText: "Постельное бельё VITA BRAVA HOME — это сочетание премиального качества и доступных цен. Наши комплекты изготовлены из натурального хлопка высших сортов.",
      },
      blankets: {
        seoTitle: "Одеяла премиум-класса — каталог | VITA BRAVA HOME",
        seoDescription: "Шёлковые, пуховые и бамбуковые одеяла VITA BRAVA HOME. Лёгкие, терморегулирующие, гипоаллергенные.",
        seoText: "Коллекция одеял VITA BRAVA HOME включает шёлковые, пуховые и бамбуковые модели для всех сезонов.",
      },
      pillows: {
        seoTitle: "Подушки премиум-класса — каталог | VITA BRAVA HOME",
        seoDescription: "Пуховые и ортопедические подушки. Натуральные наполнители, гипоаллергенные чехлы.",
        seoText: "Подушки VITA BRAVA HOME с наполнителями из натурального пуха, шёлка и инновационных материалов для комфортного сна.",
      },
      throws: {
        seoTitle: "Пледы премиум-класса — каталог | VITA BRAVA HOME",
        seoDescription: "Кашемировые, шерстяные и хлопковые пледы. Тёплые и стильные аксессуары для дома.",
        seoText: "Пледы VITA BRAVA HOME — натуральный кашемир, мериносовая шерсть и органический хлопок. Идеальный аксессуар для уюта.",
      },
      home: {
        seoTitle: "Домашний текстиль — каталог | VITA BRAVA HOME",
        seoDescription: "Домашний текстиль премиум-класса: скатерти, салфетки, декоративные наволочки. VITA BRAVA HOME.",
        seoText: "Домашний текстиль VITA BRAVA HOME: декоративные элементы для создания уютной атмосферы в вашем доме.",
      },
      towels: {
        seoTitle: "Полотенца премиум-класса — каталог | VITA BRAVA HOME",
        seoDescription: "Банные и пляжные полотенца из турецкого хлопка. Мягкие, впитывающие, износостойкие.",
        seoText: "Полотенца VITA BRAVA HOME из 100% турецкого хлопка высшего качества. Плотность 500-700 г/м².",
      },
      boudoir: {
        seoTitle: "Будуарные наряды — каталог | VITA BRAVA HOME",
        seoDescription: "Элегантные халаты, пеньюары и будуарные комплекты из шёлка и атласа. VITA BRAVA HOME.",
        seoText: "Будуарная коллекция VITA BRAVA HOME — изысканные халаты, пеньюары и комплекты из натурального шёлка.",
      },
    };

    for (const cat of cats.data) {
      const seo = catSeo[cat.slug];
      if (seo) {
        await put(`categories/${cat.documentId}`, seo);
      }
    }
  }

  // --- 4. Home Page: hitTabs, promoBannerItems ---
  console.log("\n4. Home Page: hitTabs + promoBannerItems...");
  const home = await get("home-page", { "populate[hitTabs]": "true", "populate[promoBannerItems]": "true" });
  if (home?.data) {
    await put("home-page", {
      hitTabs: [
        { label: "Хиты продаж", filterKey: "hits" },
        { label: "Новинки", filterKey: "new" },
        { label: "Акции", filterKey: "sale" },
      ],
      promoBannerItems: [
        { title: "1+1 на любимые товары", subtitle: "Второй товар в подарок", link: "/special-offers" },
        { title: "Скидка 15% на первый заказ", subtitle: "По промокоду WELCOME", link: "/catalog" },
      ],
      promoBannerTitle: "Специальные предложения",
    });
  }

  // --- 5. Contacts: socials icons ---
  console.log("\n5. Contacts: socials...");
  const contacts = await get("contacts-page", { "populate[socials]": "true" });
  if (contacts?.data) {
    const socials = (contacts.data.socials || []).map(({ id, icon, ...r }) => ({
      ...r,
      icon: r.platform === "telegram" ? "telegram" : r.platform === "whatsapp" ? "whatsapp" : (r.platform || "link"),
    }));
    if (socials.length) {
      await put("contacts-page", { socials });
    }
  }

  console.log("\n═══ Done! ═══\n");
}

main().catch(console.error);
