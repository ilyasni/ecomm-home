/**
 * Заполнение контента — исправленная версия с правильными полями компонентов.
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
  console.log("\n═══ Fill Content v2 ═══\n");

  // --- 1. Articles: toc + dynamic zone sections ---
  console.log("1. Articles...");
  const articles = await get("articles", { "pagination[pageSize]": "10" });
  if (articles?.data) {
    const articleContents = {
      "kak-vybrat-postelnoe-bele": {
        toc: [
          { anchorId: "fabric", label: "Выбор ткани" },
          { anchorId: "sizes", label: "Размеры" },
          { anchorId: "care", label: "Уход за бельём" },
        ],
        sections: [
          { __component: "article.section-heading", anchorId: "fabric", content: "Выбор ткани" },
          { __component: "article.section-text", content: "Качественное постельное бельё начинается с правильного выбора ткани. **Сатин** — гладкая и плотная ткань с шелковистым блеском. **Бязь** — прочная и доступная. **Батист** — тонкая и нежная ткань для тех, кто ценит мягкость.\n\nПлотность ткани измеряется в TC (Thread Count): от 200 TC — базовое качество, 300-400 TC — премиум, 500+ TC — люкс." },
          { __component: "article.section-heading", anchorId: "sizes", content: "Размеры" },
          { __component: "article.section-text", content: "Стандартные размеры постельного белья в России:\n- **Полутороспальное** — 150×210 см\n- **Двуспальное** — 175×210 см\n- **Евро** — 200×220 см\n- **Семейное** — два пододеяльника 150×210 см\n\nПеред покупкой измерьте матрас и подушки." },
          { __component: "article.section-heading", anchorId: "care", content: "Уход за бельём" },
          { __component: "article.section-text", content: "Стирайте при температуре не выше 40°C с мягким моющим средством. Не используйте отбеливатели. Сушите на воздухе, избегая прямых солнечных лучей. Гладьте при средней температуре. Сатин не требует глажки, если сушить его в расправленном виде." },
        ],
      },
      "trendy-domashnego-tekstilya": {
        toc: [
          { anchorId: "natural", label: "Натуральные материалы" },
          { anchorId: "colors", label: "Цветовые тренды" },
        ],
        sections: [
          { __component: "article.section-heading", anchorId: "natural", content: "Натуральные материалы" },
          { __component: "article.section-text", content: "В 2025–2026 году тренд на устойчивое развитие продолжает влиять на индустрию домашнего текстиля. Покупатели выбирают **органический хлопок**, **лён**, **бамбуковое волокно** и **тенсель**. Эти материалы экологичны, гипоаллергенны и обеспечивают комфортный сон.\n\nVITA BRAVA HOME использует сертифицированные ткани **OEKO-TEX Standard 100**." },
          { __component: "article.section-heading", anchorId: "colors", content: "Цветовые тренды" },
          { __component: "article.section-text", content: "Актуальная палитра: приглушённые земляные тона (терракота, охра, оливковый), нежные пастельные оттенки (лавандовый, пыльная роза, мятный), а также классические нейтральные — белый, кремовый и серый. Геометрические принты уступают место флоральным мотивам и абстрактным узорам." },
        ],
      },
      "uhod-za-shelkovymi-izdeliyami": {
        toc: [
          { anchorId: "washing", label: "Стирка" },
          { anchorId: "storage", label: "Хранение" },
        ],
        sections: [
          { __component: "article.section-heading", anchorId: "washing", content: "Стирка" },
          { __component: "article.section-text", content: "Шёлк требует бережного ухода. Стирайте **вручную** или в режиме **деликатной стирки** при температуре не выше 30°C. Используйте специальное средство для шёлка или мягкий шампунь. Не выкручивайте изделие — аккуратно отожмите через полотенце." },
          { __component: "article.section-heading", anchorId: "storage", content: "Хранение" },
          { __component: "article.section-text", content: "Храните шёлковые изделия в тканевых чехлах, избегая пластиковых пакетов — ткань должна «дышать». Используйте лаванду или кедровые шарики для защиты от моли. Не складывайте шёлк надолго — лучше вешать на плечики." },
        ],
      },
      "podarki-dlya-doma": {
        toc: [
          { anchorId: "ideas", label: "Идеи подарков" },
          { anchorId: "certificates", label: "Подарочные сертификаты" },
        ],
        sections: [
          { __component: "article.section-heading", anchorId: "ideas", content: "Идеи подарков" },
          { __component: "article.section-text", content: "Домашний текстиль — универсальный подарок для любого повода:\n- **Комплект постельного белья** — идеален на новоселье\n- **Кашемировый плед** — отличный подарок на день рождения\n- **Набор банных полотенец** — практичный и стильный подарок\n- **Будуарный комплект** — романтический подарок для особого случая" },
          { __component: "article.section-heading", anchorId: "certificates", content: "Подарочные сертификаты" },
          { __component: "article.section-text", content: "Если вы не уверены в выборе, **подарочный сертификат VITA BRAVA HOME** — идеальное решение. Доступны номиналы от 3 000 до 50 000 ₽. Сертификат действует 12 месяцев и может быть использован в любом бутике или интернет-магазине." },
        ],
      },
    };

    for (const art of articles.data) {
      const content = articleContents[art.slug];
      if (content) {
        await put(`articles/${art.documentId}`, content);
      }
    }
  }

  // --- 2. Products: SEO + specifications (key/value, not label/value) ---
  console.log("\n2. Products...");
  const products = await get("products", { "pagination[pageSize]": "20" });
  if (products?.data) {
    const productDetails = {
      "filigran-bed-set": {
        seoTitle: "КПБ Филигрань — купить постельное бельё премиум | VITA BRAVA HOME",
        seoDescription: "Комплект постельного белья Филигрань из сатина высшего качества. Плотность 400 TC.",
        weight: 2.8,
        composition: "100% хлопок (сатин), плотность 400 TC",
        careInstructions: "Стирка при 40°C, не отбеливать, гладить при средней температуре",
        sizes: [
          { label: "Евро", value: "200×220 см" },
          { label: "Семейный", value: "2×150×210 см" },
        ],
        specifications: [
          { key: "Материал", value: "Сатин" },
          { key: "Состав", value: "100% хлопок" },
          { key: "Плотность", value: "400 TC" },
          { key: "Страна", value: "Россия" },
        ],
      },
      "premium-fitted-sheet": {
        seoTitle: "Простыня на резинке Premium — купить | VITA BRAVA HOME",
        seoDescription: "Простыня на резинке Premium из сатина 300 TC. Плотная посадка.",
        weight: 0.9,
        composition: "100% хлопок (сатин), плотность 300 TC",
        careInstructions: "Стирка при 40°C, не отбеливать, сушка в расправленном виде",
        sizes: [
          { label: "160×200 см", value: "высота 30 см" },
          { label: "180×200 см", value: "высота 30 см" },
        ],
        specifications: [
          { key: "Материал", value: "Сатин" },
          { key: "Состав", value: "100% хлопок" },
          { key: "Плотность", value: "300 TC" },
          { key: "Резинка", value: "по всему периметру" },
        ],
      },
      "comfort-pillow": {
        seoTitle: "Подушка пуховая Comfort — купить | VITA BRAVA HOME",
        seoDescription: "Подушка с наполнителем из белого утиного пуха. Мягкая и гипоаллергенная.",
        weight: 1.2,
        composition: "Наполнитель: 90% пух, 10% перо. Чехол: 100% хлопок (батист)",
        careInstructions: "Химчистка или деликатная стирка при 30°C, сушить горизонтально",
        sizes: [
          { label: "50×70 см", value: "стандарт" },
          { label: "70×70 см", value: "евро" },
        ],
        specifications: [
          { key: "Наполнитель", value: "Белый утиный пух 90/10" },
          { key: "Чехол", value: "Хлопок-батист" },
          { key: "Упругость", value: "Средняя" },
          { key: "Гипоаллергенно", value: "Да" },
        ],
      },
      "elegance-silk-blanket": {
        seoTitle: "Одеяло из шёлка Elegance — купить | VITA BRAVA HOME",
        seoDescription: "Шёлковое одеяло Elegance из натурального шёлка Mulberry. Лёгкое, терморегулирующее.",
        weight: 2.0,
        composition: "Наполнитель: 100% шёлк Mulberry. Чехол: 100% хлопок (батист)",
        careInstructions: "Только химчистка. Проветривать на свежем воздухе.",
        sizes: [
          { label: "200×220 см", value: "евро" },
          { label: "150×210 см", value: "полуторное" },
        ],
        specifications: [
          { key: "Наполнитель", value: "Шёлк Mulberry" },
          { key: "Чехол", value: "Хлопок-батист" },
          { key: "Плотность наполнителя", value: "300 г/м²" },
          { key: "Всесезонное", value: "Да" },
        ],
      },
      "classic-cashmere-throw": {
        seoTitle: "Плед кашемировый Classic — купить | VITA BRAVA HOME",
        seoDescription: "Кашемировый плед Classic — мягкость натурального кашемира. Для гостиной и спальни.",
        weight: 1.5,
        composition: "100% кашемир",
        careInstructions: "Химчистка. Хранить в тканевом чехле. Не гладить.",
        sizes: [
          { label: "130×180 см", value: "стандарт" },
        ],
        specifications: [
          { key: "Материал", value: "Кашемир" },
          { key: "Состав", value: "100% кашемир" },
          { key: "Бахрома", value: "Да" },
          { key: "Страна", value: "Россия" },
        ],
      },
      "gift-certificate": {
        seoTitle: "Подарочный сертификат VITA BRAVA HOME",
        seoDescription: "Подарочный сертификат VITA BRAVA HOME — идеальный подарок. Номиналы от 3 000 до 50 000 ₽.",
        subtitle: "Подарок, которому будет рад каждый",
        giftCertDescription: "Подарочный сертификат VITA BRAVA HOME можно использовать в бутиках и интернет-магазине. Срок действия — 12 месяцев.",
        specifications: [
          { key: "Номинал", value: "3 000 — 50 000 ₽" },
          { key: "Срок действия", value: "12 месяцев" },
          { key: "Где использовать", value: "Бутики и интернет-магазин" },
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

  // --- 3. Home Page: hitTabs (filterType), promoBannerItems ---
  console.log("\n3. Home Page: hitTabs + promoBannerItems...");
  await put("home-page", {
    hitTabs: [
      { label: "Хиты продаж", filterType: "hits" },
      { label: "Новинки", filterType: "new" },
      { label: "Акции", filterType: "sale" },
    ],
    promoBannerItems: [
      { title: "1+1 на любимые товары", description: "Второй товар в подарок", icon: "gift" },
      { title: "Скидка 15% на первый заказ", description: "По промокоду WELCOME", icon: "discount" },
    ],
    promoBannerTitle: "Специальные предложения",
  });

  console.log("\n═══ Done! ═══\n");
}

main().catch(console.error);
