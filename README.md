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
├── docker-compose.yml   # Оркестрация всех сервисов
├── .env.example         # Шаблон переменных окружения
└── .cursor/rules/       # Cursor AI правила
```

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
