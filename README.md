# Vita Brava Home

Интернет-магазин премиального домашнего текстиля — постельное бельё, подушки, одеяла, будуарные наряды.

## Стек технологий

| Компонент   | Технология             | Версия |
|-------------|------------------------|--------|
| Frontend    | Next.js (App Router)   | 16+    |
| UI          | React, Tailwind CSS    | 19+, 4 |
| CMS         | Strapi (Headless)      | 5      |
| Database    | PostgreSQL             | 16     |
| Cache       | Redis                  | 7      |
| Infra       | Docker Compose         | —      |
| Lang        | TypeScript (strict)    | 5      |

**Планируется:** Medusa v2 (e-commerce engine — заказы, корзина, оплата).

## Структура репозитория

```
ecomm-home/
├── frontend/            # Next.js 16 (App Router) — SSR/RSC
│   ├── src/
│   │   ├── app/         # Маршруты (App Router)
│   │   ├── components/  # Компоненты по секциям
│   │   ├── design-system/ # UI-примитивы, токены, иконки
│   │   ├── data/        # Моки (временно, до интеграции со Strapi)
│   │   ├── lib/         # Strapi API клиент
│   │   └── types/       # TypeScript типы
│   └── public/assets/   # Статические ассеты
├── cms/                 # Strapi 5 (Headless CMS)
│   ├── config/          # DB, server, admin, middlewares, plugins
│   └── src/api/         # Content Types
├── old_site_va_home/    # Старый сайт (НЕ в git, только локально)
├── docker-compose.yml   # Оркестрация всех сервисов
├── .env.example         # Шаблон переменных окружения
└── .cursor/rules/       # Cursor AI правила
```

## Старый сайт (old_site_va_home/)

> **Внимание:** Папка исключена из git (`.gitignore`). Хранится только локально как справочный материал для миграции. Содержит credentials — не коммитить.

Старый сайт работает на **OpenCart 3.x** (PHP/MySQL), хостинг — Beget. URL: `https://vitabrava-home.ru/`

### Содержимое

| Компонент | Описание |
|-----------|----------|
| `karabcjv_home.sql` | MySQL-дамп базы данных (10.9 MB, 176 таблиц) |
| `public_html/` | Исходный код OpenCart (PHP) |
| `public_html/image/catalog/` | Фотографии товаров (978 файлов) |
| `public_html/admin/` | Админ-панель OpenCart |
| `public_html/catalog/` | Фронтенд OpenCart (контроллеры, модели, шаблоны) |
| `public_html/system/` | Ядро OpenCart (engine, библиотеки, конфиг) |

### Данные из SQL-дампа

**Категории (5 шт.):**

| ID  | Название          |
|-----|-------------------|
| 138 | Постельное бельё  |
| 139 | Подушки           |
| 140 | Одеяла            |
| 141 | Будуарные наряды  |
| 137 | Тестовое          |

**Товары:** 59 позиций. Примеры:

| Название | Категория | Цена (руб.) |
|----------|-----------|-------------|
| Julianna 601 | Будуарные наряды | 14 200 |
| Julianna 603 | Будуарные наряды | 14 200 |
| Julianna 605 | Будуарные наряды | 14 500 |
| AREA MINK | Постельное бельё | 17 000 |

**Изображения (978 файлов) по папкам:**

| Папка | Файлов | Содержание |
|-------|--------|------------|
| `clothing/` | 64 | Будуарные наряды |
| `Maun/` | 89 | Постельное бельё |
| `EURO SIZE/` | 30 | Евро-комплекты |
| `FAMILY SIZE/` | 13 | Семейные комплекты |
| `photo-products/` | 98 | Студийные фото товаров |
| `VA-HOME/` | ~350 | Основные фото коллекций |
| `podushki/` | 16 | Подушки |
| `Odeyala/` | 10 | Одеяла |
| `demo/` | 161 | Демо-данные OpenCart |

**Дополнительные таблицы:** заказы, клиенты, купоны, баннеры, статьи блога, атрибуты товаров, СДЭК-интеграция (`oc_cdek_order_meta`).

### Использование при миграции

- SQL-дамп — источник данных для наполнения Strapi (товары, описания, цены, категории)
- `image/catalog/` — фотографии для загрузки в Strapi Media Library
- `config.php` — параметры старого сайта (домен, пути). **Содержит credentials — не коммитить!**

## Быстрый старт

### Предварительные требования

- Docker Desktop (с Docker Compose v2)
- Node.js 20+ (для локальной разработки без Docker)
- Git

### Запуск через Docker

```bash
# 1. Клонировать репозиторий
git clone https://github.com/ilyasni/ecomm-home.git
cd ecomm-home

# 2. Создать .env из шаблона и заполнить секреты
cp .env.example .env

# 3. Поднять все сервисы
docker compose up -d

# 4. Открыть
# Frontend: http://localhost:3000
# Strapi Admin: http://localhost:1337/admin
```

### Локальная разработка (без Docker)

```bash
# Frontend
cd frontend
npm install
npm run dev          # http://localhost:3000

# CMS (требует PostgreSQL и .env)
cd cms
npm install
npm run develop      # http://localhost:1337
```

## Переменные окружения

См. [.env.example](.env.example) — шаблон со всеми переменными.

Основные группы:
- `POSTGRES_*` — подключение к PostgreSQL
- `REDIS_*` — подключение к Redis
- `STRAPI_*` — секреты и настройки Strapi
- `NEXT_PUBLIC_STRAPI_*` — URL Strapi для фронтенда

## Полезные команды

```bash
# Docker
docker compose up -d              # Поднять все сервисы
docker compose up -d --build cms  # Пересобрать CMS
docker compose logs -f frontend   # Логи фронтенда
docker compose down               # Остановить
docker compose down -v            # Остановить + удалить данные

# Frontend
cd frontend
npm run dev        # Dev-сервер
npm run build      # Production-сборка
npm run lint       # ESLint

# CMS
cd cms
npm run develop    # Dev-сервер с hot-reload
npm run build      # Production-сборка
npm run start      # Production-запуск

# Seed — наполнение Strapi контентом
# 1. Создай API Token: Strapi Admin → Settings → API Tokens → Full Access
# 2. Запусти:
STRAPI_ADMIN_TOKEN=<token> npx ts-node --esm cms/scripts/seed.ts
```

## Cursor Rules

Правила для AI-ассистента в `.cursor/rules/`:

| Файл | Область |
|------|---------|
| `general.mdc` | Общие стандарты, Context7, стек |
| `nextjs.mdc` | Next.js App Router conventions |
| `strapi.mdc` | Strapi 5 CMS conventions |
| `typescript.mdc` | TypeScript strict mode |
| `tailwind.mdc` | Tailwind CSS 4, дизайн-токены |
| `docker.mdc` | Docker/Compose conventions |
| `figma-design-system.mdc` | Дизайн-система, Figma workflow |
| `testing.mdc` | Vitest, Testing Library |
