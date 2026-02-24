/**
 * Заполнение тела статей с правильными slug'ами.
 */

const STRAPI_URL = "http://localhost:1337";
const TOKEN = "445c30fec01628915203e6620693e58679803465cc39de150d7482800760feb193d64d83a4655b5fb94cfffe2949fe74b5fe8c3eb08f7f13d3227f961d9140ce240b47b2842193c17776cc2bfbb2fb82f882d383bbc9d404c0e81b4fa780fc322d6a3b9e8d27dabcf5fc732c32273274d2a41975c565b475688964360a946c58";
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

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
  console.log("\n═══ Fill Articles ═══\n");

  const articleContents = {
    kp4ah1laot94nz2lrz6fpb20: {
      toc: [
        { anchorId: "exhibition", label: "О выставке" },
        { anchorId: "collections", label: "Представленные коллекции" },
        { anchorId: "results", label: "Итоги участия" },
      ],
      sections: [
        { __component: "article.section-heading", anchorId: "exhibition", content: "О выставке" },
        { __component: "article.section-text", content: "Международная выставка «Текстиль-2025» прошла с 15 по 18 октября в Экспоцентре (Москва). В этом году мероприятие собрало более **350 компаний** из 28 стран, включая ведущих производителей домашнего текстиля, интерьерных тканей и фурнитуры.\n\nVITA BRAVA HOME приняла участие в выставке уже в третий раз, представив обновлённые коллекции сезона осень-зима 2025." },
        { __component: "article.section-heading", anchorId: "collections", content: "Представленные коллекции" },
        { __component: "article.section-text", content: "На стенде VITA BRAVA HOME были представлены:\n\n- **Коллекция Premium** — новые расцветки КПБ из сатина 400+ TC\n- **Коллекция Medium** — обновлённая линейка с улучшенным составом\n- **Кашемировые пледы** — эксклюзивные модели ручной работы\n- **Будуарная коллекция** — шёлковые халаты и пеньюары\n\nОсобый интерес посетителей вызвала новая серия **Elegance**, в которой используется натуральный шёлк Mulberry." },
        { __component: "article.section-heading", anchorId: "results", content: "Итоги участия" },
        { __component: "article.section-text", content: "За четыре дня работы выставки стенд VITA BRAVA HOME посетили более **1 200 специалистов** — байеры розничных сетей, дизайнеры интерьеров, представители отельного бизнеса и оптовые покупатели. Были заключены контракты на поставку с 15 новыми партнёрами из России и СНГ." },
      ],
    },
    f3fv9hya1f23tpipfawm539k: {
      toc: [
        { anchorId: "material", label: "Выбор материала" },
        { anchorId: "density", label: "Плотность ткани" },
        { anchorId: "sizes", label: "Размеры" },
        { anchorId: "care", label: "Уход" },
      ],
      sections: [
        { __component: "article.section-heading", anchorId: "material", content: "Выбор материала" },
        { __component: "article.section-text", content: "Ключевой фактор при выборе полотенец — это материал. Лучшим выбором считается **100% турецкий хлопок** — он мягкий, хорошо впитывает влагу и долго сохраняет форму.\n\n**Египетский хлопок** (длинноволокнистый) — ещё более мягкий и износостойкий, но стоит дороже. **Бамбуковое волокно** подойдёт аллергикам — оно гипоаллергенно и обладает антибактериальными свойствами." },
        { __component: "article.section-heading", anchorId: "density", content: "Плотность ткани" },
        { __component: "article.section-text", content: "Плотность полотенец измеряется в г/м²:\n\n- **300–400 г/м²** — лёгкие полотенца для рук и лица, быстро сохнут\n- **400–600 г/м²** — универсальные банные полотенца, оптимальный баланс мягкости и впитываемости\n- **600–800 г/м²** — премиальные, очень мягкие и пышные, но сохнут дольше\n\nДля ежедневного использования рекомендуем плотность **500–600 г/м²**." },
        { __component: "article.section-heading", anchorId: "sizes", content: "Размеры" },
        { __component: "article.section-text", content: "Стандартные размеры полотенец:\n- **Для лица** — 30×50 см\n- **Для рук** — 50×100 см\n- **Банное** — 70×140 см\n- **Пляжное** — 80×160 см или 100×180 см\n\nДля комплекта на одного человека достаточно 2 полотенца для рук и 2 банных." },
        { __component: "article.section-heading", anchorId: "care", content: "Уход" },
        { __component: "article.section-text", content: "Новые полотенца перед первым использованием обязательно постирайте — это повысит их впитываемость. Стирайте при **40–60°C** с мягким порошком. Не используйте кондиционер — он снижает впитывающие свойства. Сушите в расправленном виде на воздухе." },
      ],
    },
    o8s9u71thmxsxc0optnhpyzy: {
      toc: [
        { anchorId: "about-satin", label: "О сатине" },
        { anchorId: "washing", label: "Правила стирки" },
        { anchorId: "drying", label: "Сушка и глажка" },
        { anchorId: "storage", label: "Хранение" },
      ],
      sections: [
        { __component: "article.section-heading", anchorId: "about-satin", content: "О сатине" },
        { __component: "article.section-text", content: "**Сатин** — это ткань особого переплетения, которая отличается гладкой, шелковистой поверхностью с характерным блеском. Постельное бельё из сатина — оптимальный выбор для тех, кто ценит комфорт и эстетику.\n\nСатин изготавливается из 100% хлопка, но благодаря технологии сатинового переплетения приобретает особые свойства: мягкость, прочность и устойчивость к деформации." },
        { __component: "article.section-heading", anchorId: "washing", content: "Правила стирки" },
        { __component: "article.section-text", content: "Чтобы сатиновое бельё служило долго и сохраняло свой вид:\n\n1. Стирайте при температуре **не выше 40°C**\n2. Используйте **жидкое моющее средство** — порошок может повредить волокна\n3. **Не используйте отбеливатели** — они разрушают структуру ткани\n4. Выворачивайте бельё **наизнанку** перед стиркой\n5. Заполняйте барабан не более чем на **2/3**\n6. Отжим — не более **600 оборотов**" },
        { __component: "article.section-heading", anchorId: "drying", content: "Сушка и глажка" },
        { __component: "article.section-text", content: "Сушите сатиновое бельё на воздухе, **избегая прямых солнечных лучей** — они могут вызвать выцветание. Не сушите в машинке при высокой температуре.\n\nПреимущество сатина — он **практически не мнётся**. Если необходима глажка, гладьте с изнанки при температуре не выше 150°C. Слегка влажное бельё гладится легче." },
        { __component: "article.section-heading", anchorId: "storage", content: "Хранение" },
        { __component: "article.section-text", content: "Храните постельное бельё в сухом, проветриваемом месте. Используйте тканевые мешки или наволочки для хранения комплектов. Не храните бельё в пластиковых пакетах — ткань должна «дышать». Размещайте ароматические саше с лавандой для свежести." },
      ],
    },
    e9q8i7r7fu24f694eblijvti: {
      toc: [
        { anchorId: "about", label: "О коллекции" },
        { anchorId: "products", label: "Состав коллекции" },
        { anchorId: "where-to-buy", label: "Где купить" },
      ],
      sections: [
        { __component: "article.section-heading", anchorId: "about", content: "О коллекции Medium" },
        { __component: "article.section-text", content: "Рады представить обновлённую **коллекцию Medium** — идеальный баланс качества и доступности. Коллекция создана для тех, кто ценит комфорт и стиль без компромиссов.\n\nВ новой коллекции мы улучшили состав тканей: теперь используется **хлопок-сатин плотностью 300 TC**, что обеспечивает мягкость, прочность и приятное прикосновение к коже." },
        { __component: "article.section-heading", anchorId: "products", content: "Состав коллекции" },
        { __component: "article.section-text", content: "В коллекцию Medium входят:\n\n- **КПБ** (евро и семейный размеры) — 12 расцветок\n- **Простыни на резинке** — 8 расцветок\n- **Наволочки** — 50×70 и 70×70 см\n- **Пододеяльники** отдельно\n\nЦветовая палитра включает как классические нейтральные тона (белый, кремовый, серый), так и модные оттенки сезона (пыльная роза, оливковый, тёмный шоколад)." },
        { __component: "article.section-heading", anchorId: "where-to-buy", content: "Где купить" },
        { __component: "article.section-text", content: "Коллекция Medium доступна:\n- В **бутиках VITA BRAVA HOME** в Москве, Санкт-Петербурге и Краснодаре\n- В **интернет-магазине** с доставкой по всей России\n- У **партнёров** — список авторизованных дилеров на сайте\n\nДля оптовых покупателей действуют специальные условия — свяжитесь с нами через форму на странице «Сотрудничество»." },
      ],
    },
  };

  for (const [docId, content] of Object.entries(articleContents)) {
    await put(`articles/${docId}`, content);
  }

  console.log("\n═══ Done! ═══\n");
}

main().catch(console.error);
