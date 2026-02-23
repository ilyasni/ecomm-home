export const aboutHero = {
  title: "VITA BRAVA HOME —\n10 лет на рынке\nтекстиля в России",
  desktopImage: "/assets/figma/about/hero-desktop.jpg",
  mobileImage: "/assets/figma/about/hero-mobile.jpg",
};

export const aboutIntro = {
  text: "VITA BRAVA HOME — это бренд домашнего текстиля, который объединяет в себе высокое качество, продуманный дизайн и доступность. Мы создаём не просто постельное бельё — мы создаём атмосферу уюта и заботы, которой вы заслуживаете каждый день.\n\nНаша миссия — сделать премиальный текстиль доступным для каждого, кто ценит комфорт и эстетику. Мы тщательно отбираем материалы, контролируем каждый этап производства и предлагаем продукцию, которая соответствует самым высоким стандартам.",
  buttonLabel: "Подробнее о бренде",
};

export const aboutAdvantages = [
  { id: "adv-1", title: "Идеальное соотношение цены и качества" },
  { id: "adv-2", title: "Большой выбор на любой бюджет" },
  { id: "adv-3", title: "Бесплатная доставка по всей России" },
];

export const aboutAdvantageImages = [
  "/assets/figma/about/advantage-1.jpg",
  "/assets/figma/about/advantage-2.jpg",
  "/assets/figma/about/advantage-3.jpg",
];

export const aboutHistory = {
  title: "История бренда VITA BRAVA HOME",
  paragraphs: [
    "В 2014 году мы основали наш бренд с ясной целью — сделать качественный домашний текстиль доступным для российских покупателей. Мы верили, что комфортный сон и красивый дом — не роскошь, а необходимость.",
    "За 10 лет мы выросли из небольшого стартапа в один из ведущих брендов домашнего текстиля в России.",
    "Мы работаем с лучшими фабриками мира — Турция, Китай, Россия, — чтобы предложить нашим клиентам самые качественные ткани и технологии.",
    "Наша цель неизменна: создавать текстиль, который дарит радость, комфорт и вдохновение каждый день.",
  ],
};

export const whatMakesUsDifferent = {
  title: "Что нас отличает",
  items: [
    {
      id: "diff-1",
      title: "Качество",
      subtitle: "Мы используем только проверенные материалы",
      image: "/assets/figma/about/different-1.jpg",
    },
    {
      id: "diff-2",
      title: "Комфорт",
      subtitle: "Наш текстиль создан для максимального удобства",
      image: "/assets/figma/about/different-2.jpg",
    },
    {
      id: "diff-3",
      title: "Доступность",
      subtitle: "Премиальное качество по разумной цене",
      image: "/assets/figma/about/different-3.jpg",
    },
  ],
};

export const aboutCollections = {
  title: "Коллекции VITA BRAVA",
  subtitle: "рассчитаны на разные бюджеты, но объединены качеством",
  items: [
    {
      id: "coll-light",
      title: "Коллекция Light",
      image: "/assets/figma/about/collection-light.jpg",
    },
    {
      id: "coll-medium",
      title: "Коллекция Medium",
      image: "/assets/figma/about/collection-medium.jpg",
    },
    {
      id: "coll-premium",
      title: "Коллекция Premium",
      image: "/assets/figma/about/collection-premium.jpg",
    },
  ],
};

export const aboutProduction = {
  title: "Поиск и выбор материала",
  steps: [
    {
      id: "step-1",
      icon: "/assets/figma/about/icon-search.svg",
      title: "Исследование рынка",
      description:
        "Изучаем мировые тренды и выбираем лучшие материалы для наших коллекций",
    },
    {
      id: "step-2",
      icon: "/assets/figma/about/icon-fabric.svg",
      title: "Тестирование тканей",
      description:
        "Проверяем каждую ткань на прочность, мягкость и устойчивость к стирке",
    },
    {
      id: "step-3",
      icon: "/assets/figma/about/icon-factory.svg",
      title: "Производство",
      description:
        "Контролируем каждый этап производства на фабриках-партнёрах",
    },
    {
      id: "step-4",
      icon: "/assets/figma/about/icon-check.svg",
      title: "Проверка",
      description:
        "Финальная проверка качества перед отправкой клиенту",
    },
  ],
};

export const aboutCreating = {
  title: "Создаем для вас",
  blocks: [
    {
      id: "creating-1",
      text: "VITA BRAVA HOME – создана для тех, кто ценит не только уют, но и эстетику повседневной жизни",
      image: "/assets/figma/about/creating-1.jpg",
      imagePosition: "left" as const,
    },
    {
      id: "creating-2",
      text: "VITA BRAVA HOME – не просто текстиль, это здоровый сон и утро, начинающееся в атмосфере уюта.",
      image: "/assets/figma/about/creating-2.jpg",
      imagePosition: "right" as const,
    },
  ],
};
