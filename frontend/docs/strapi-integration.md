# Интеграция Vita Brava Home со Strapi v5

## Содержание

1. [Обзор архитектуры](#1-обзор-архитектуры)
2. [Env-переменные](#2-env-переменные)
3. [API-клиент](#3-api-клиент)
4. [Strapi Content Types](#4-strapi-content-types)
5. [Маппинг страниц на API-эндпоинты](#5-маппинг-страниц-на-api-эндпоинты)
6. [Миграция компонентов на Server Components](#6-миграция-компонентов-на-server-components)
7. [Кеширование и ревалидация](#7-кеширование-и-ревалидация)
8. [Работа с медиа](#8-работа-с-медиа)
9. [Аутентификация](#9-аутентификация)
10. [Пошаговый план внедрения](#10-пошаговый-план-внедрения)
11. [Rollback-стратегия](#11-rollback-стратегия)

---

## 1. Обзор архитектуры

### Текущее состояние

- Все данные — статические моки в `src/data/*.ts` (15 файлов)
- Все компоненты — `"use client"` (CSR)
- Нет API-слоя, нет state management

### Целевое состояние

```
Frontend (Next.js 16)               Strapi v5
┌────────────────────┐              ┌──────────────────┐
│ Server Components  │──fetch()───> │ REST API /api/*   │
│  (каталог, статьи) │              │                  │
├────────────────────┤              │ Media Library     │
│ Client Components  │              │                  │
│  (корзина, формы)  │──fetch()───> │ Users&Permissions │
├────────────────────┤              └──────────────────┘
│ src/lib/strapi.ts  │
│ src/lib/queries/*  │
│ src/types/*        │
└────────────────────┘
```

### Созданные файлы

| Файл | Назначение |
|---|---|
| `src/lib/strapi.ts` | Базовый API-клиент |
| `src/lib/queries/*.ts` | Запросы к каждой группе контента |
| `src/types/*.ts` | TypeScript-интерфейсы всех сущностей |
| `src/types/strapi.ts` | Generics для Strapi response format |
| `src/components/ui/Container.tsx` | Унификация контейнерных отступов |
| `.env.local.example` | Шаблон env-переменных |

---

## 2. Env-переменные

Скопировать `.env.local.example` в `.env.local`:

```bash
cp .env.local.example .env.local
```

| Переменная | Описание | Доступность |
|---|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | URL Strapi API | Server + Client |
| `STRAPI_API_TOKEN` | API-токен (read-only) | Server only |
| `NEXT_PUBLIC_STRAPI_MEDIA_URL` | URL для медиафайлов | Server + Client |
| `STRAPI_MEDIA_HOSTNAME` | Hostname для `next.config.ts` `remotePatterns` | Build-time |

> Токен `STRAPI_API_TOKEN` — без префикса `NEXT_PUBLIC_`, чтобы не попадал в клиентский бандл.

---

## 3. API-клиент

Файл: `src/lib/strapi.ts`

### Основные функции

| Функция | Описание | Пример |
|---|---|---|
| `strapiGet<T>(path, params, options)` | Базовый GET-запрос | `strapiGet("/products")` |
| `strapiFind<T>(contentType, params, options)` | Список записей | `strapiFind("products", { "sort[0]": "price:asc" })` |
| `strapiFindOne<T>(contentType, id, params, options)` | Запись по ID | `strapiFindOne("products", 42)` |
| `strapiFindBySlug<T>(contentType, slug, params, options)` | Запись по slug | `strapiFindBySlug("products", "peterbourg")` |
| `strapiSingleType<T>(contentType, params, options)` | Single Type | `strapiSingleType("home-page")` |
| `getStrapiMediaUrl(path)` | Полный URL медиафайла | `getStrapiMediaUrl("/uploads/photo.jpg")` |

### Параметры кеширования

```typescript
// ISR — ревалидация каждые 60 секунд (по умолчанию)
await strapiFind("products");

// SSR — без кеша
await strapiFind("orders", {}, { cache: "no-store" });

// ISR с тегами (для on-demand revalidation)
await strapiFind("products", {}, { revalidate: 120, tags: ["products"] });

// Статический (force-cache)
await strapiFind("info-pages", {}, { revalidate: false });
```

---

## 4. Strapi Content Types

### 4.1 Collection Types (12)

#### Product
```
- title: string (required)
- slug: uid (from title)
- description: text
- price: decimal (required)
- oldPrice: decimal
- image: media (single, required)
- gallery: media (multiple)
- badge: string
- rating: float
- sku: string (unique)
- inStock: boolean (default: true)
- type: enum [product, giftCertificate, set]
- subtitle: string
- giftCertDescription: richtext
- colors: component (repeatable) → shared.product-color
- setItems: relation (has-many → SetItem)
- categories: relation (many-to-many → Category)
- collections: relation (many-to-many → Collection)
```

#### Category
```
- label: string (required)
- slug: uid (from label)
- icon: string
- image: media (single)
- order: integer (для сортировки)
- subcategories: component (repeatable) → catalog.subcategory
- filters: component (repeatable) → catalog.catalog-filter
- products: relation (many-to-many → Product)
```

#### Collection
```
- title: string (required)
- slug: uid (from title)
- heroTitle: string
- heroSubtitle: text
- heroImages: media (multiple)
- descriptionTitle: string
- descriptionParagraphs: richtext
- mediaImage: media (single)
- mediaVideo: media (single)
- bannerTitle: string
- bannerDescription: text
- bannerButtonLabel: string
- bannerImage: media (single)
- products: relation (many-to-many → Product)
```

#### SetItem
```
- title: string (required)
- subtitle: string
- price: decimal
- oldPrice: decimal
- image: media (single)
- sizes: component (repeatable) → shared.size-option
- product: relation (belongs-to → Product)
```

#### Article (новости + статьи)
```
- title: string (required)
- slug: uid (from title)
- category: enum [новости, идеи, новинки, ткани]
- date: date
- excerpt: text
- image: media (single)
- toc: component (repeatable) → article.toc-item
- sections: dynamic zone [
    article.section-heading,
    article.section-text,
    article.section-list,
    article.section-images,
    article.section-table
  ]
```

#### SpecialOffer
```
- title: string (required)
- subtitle: string
- image: media (single)
```

#### Boutique
```
- name: string
- city: string (required)
- address: string (required)
- metro: string
- metroDetail: string
- schedule: string
- scheduleTime: string
- phone: string
- email: email
- workingHours: string
- mapImage: media (single)
```

#### Order
```
- number: string (required, unique)
- status: enum [Получен, Отменён, В доставке, Обработка]
- date: datetime
- deliveryType: string
- deliveryAddress: string
- deliveryDate: string
- paymentMethod: string
- total: decimal
- products: component (repeatable) → order.order-line-item
- user: relation (belongs-to → User)
```

#### Address
```
- label: string
- region: string
- city: string
- street: string
- isPrimary: boolean (default: false)
- user: relation (belongs-to → User)
```

#### BonusOperation
```
- date: date
- description: string
- amount: integer
- user: relation (belongs-to → User)
```

#### DeliveryCity
```
- name: string (required)
- region: string
```

#### InfoPage
```
- title: string (required)
- slug: uid (from title)
- breadcrumbLabel: string
- sections: component (repeatable) → info.info-section
```

### 4.2 Single Types (7)

#### HomePage
```
- heroSlides: component (repeatable) → home.hero-slide
- categories: relation (many-to-many → Category)
- hits: relation (many-to-many → Product)
- budgetCollections: component (repeatable) → home.budget-collection
- advantages: component (repeatable) → shared.advantage
- advantageImages: media (multiple)
- feedbacks: component (repeatable) → home.feedback
```

#### AboutPage
```
- hero: component → about.hero
- intro: richtext
- advantages: component (repeatable) → shared.advantage
- advantageImages: media (multiple)
- history: component → about.history
- whatMakesUsDifferent: component (repeatable) → about.difference-item
- collections: component (repeatable) → about.collection-item
- production: component (repeatable) → about.production-step
- creating: component (repeatable) → about.creating-block
```

#### CooperationPage
```
- hero: component → cooperation.hero
- intro: richtext
- partnerOfferItems: component (repeatable) → cooperation.partner-offer-item
- advantages: component (repeatable) → shared.advantage
- advantageImages: media (multiple)
```

#### ContactsPage
```
- phone: string
- email: email
- socials: component (repeatable) → shared.social-link
- image: media (single)
- boutiques: relation (one-to-many → Boutique)
```

#### CustomerInfoPage
```
- categories: dynamic zone [customer-info.info-category]
```

#### LoyaltyPage
```
- hero: component → loyalty.hero
- steps: component (repeatable) → loyalty.loyalty-step
- balanceCheck: component → loyalty.balance-check
- faq: component (repeatable) → loyalty.faq-item
```

#### SpecialOffersPage
```
- offers: relation (one-to-many → SpecialOffer)
- bonusSection: component → shared.cta-section
```

### 4.3 Reusable Components (27)

| Категория | Компонент | Поля |
|---|---|---|
| **shared** | product-color | `name: string, hex: string` |
| **shared** | size-option | `value: string, label: string` |
| **shared** | advantage | `title: string` |
| **shared** | social-link | `label: string, href: string` |
| **shared** | cta-section | `title: string, description: text, buttonLabel: string, image: media` |
| **home** | hero-slide | `title, subtitle, action: string, desktopImage: media, mobileImage: media` |
| **home** | budget-collection | `title: string, price: string, image: media` |
| **home** | feedback | `name, city, text: string, avatar: media` |
| **catalog** | subcategory | `label: string, href: string` |
| **catalog** | catalog-filter | `title: string, options: component[] → catalog.filter-option` |
| **catalog** | filter-option | `label: string, href: string` |
| **article** | toc-item | `label: string` |
| **article** | section-heading | `id: string, content: string` |
| **article** | section-text | `content: richtext` |
| **article** | section-list | `items: json` |
| **article** | section-images | `images: component[] → article.section-image` |
| **article** | section-image | `image: media, alt: string` |
| **article** | section-table | `headers: json, rows: json` |
| **info** | info-section | `title: string, paragraphs: richtext` |
| **order** | order-line-item | `product: relation → Product, quantity: integer, selectedSize, selectedColor: string` |
| **loyalty** | hero | `title, description: string, buttonLabel: string, image: media` |
| **loyalty** | loyalty-step | `iconsCount: integer, title, description: string` |
| **loyalty** | balance-check | `title, description, buttonLabel: string, image: media` |
| **loyalty** | faq-item | `question: string, answer: text` |
| **about** | hero | `title: string, desktopImage: media, mobileImage: media` |
| **about** | difference-item | `title, subtitle: string, image: media` |
| **cooperation** | partner-offer-item | `title, description: string` |

---

## 5. Маппинг страниц на API-эндпоинты

| Маршрут | Query-функция | Strapi endpoint | Кеш |
|---|---|---|---|
| `/` | `getHomePage()` + `getHomeNews()` | `GET /api/home-page?populate=...` | ISR 60s |
| `/catalog` | `getCategories()` | `GET /api/categories?populate=...` | ISR 120s |
| `/catalog/sets` | `getSetProducts()` | `GET /api/products?filters[type]=set` | ISR 60s |
| `/catalog/[slug]` | `getProductBySlug(slug)` | `GET /api/products?filters[slug]=...` | ISR 60s |
| `/catalog/sets/[slug]` | `getProductBySlug(slug)` | `GET /api/products?filters[slug]=...` | ISR 60s |
| `/collections/[slug]` | `getCollectionBySlug(slug)` | `GET /api/collections?filters[slug]=...` | ISR 60s |
| `/cart` | Client-side state | — | no-store |
| `/checkout` | Client-side state | — | no-store |
| `/checkout/success` | Client-side state | — | no-store |
| `/favorites` | Client-side state | — | no-store |
| `/about` | `getAboutPage()` | `GET /api/about-page?populate=...` | ISR 300s |
| `/news` | `getArticles()` | `GET /api/articles?populate=...` | ISR 60s |
| `/news/[slug]` | `getArticleBySlug(slug)` | `GET /api/articles?filters[slug]=...` | ISR 60s |
| `/special-offers` | `getSpecialOffersPage()` | `GET /api/special-offers-page?populate=...` | ISR 60s |
| `/contacts` | `getContactsPage()` | `GET /api/contacts-page?populate=...` | ISR 300s |
| `/cooperation` | `getCooperationPage()` | `GET /api/cooperation-page?populate=...` | ISR 300s |
| `/customer-info` | `getCustomerInfoPage()` | `GET /api/customer-info-page?populate=...` | ISR 300s |
| `/loyalty` | `getLoyaltyPage()` | `GET /api/loyalty-page?populate=...` | ISR 300s |
| `/info/[slug]` | `getInfoPageBySlug(slug)` | `GET /api/info-pages?filters[slug]=...` | ISR 300s |
| `/account/*` | `getUserProfile()`, `getOrders()` | `GET /api/users/me`, `/api/orders` | no-store |

---

## 6. Миграция компонентов на Server Components

### Компоненты, которые останутся Client (`"use client"`)

Интерактивные компоненты, требующие `useState`, `useEffect`, обработчиков событий:

| Компонент | Причина |
|---|---|
| Header | Scroll-state, mobile menu toggle, dropdown interactions |
| Footer | Collapsible sections на mobile |
| Hero | Swiper carousel |
| Feedback | Swiper carousel |
| ProductCard | Hover-эффекты, quick view, favorites toggle |
| CatalogFilters / FiltersPanel | Интерактивные фильтры |
| CatalogSort / MobileToolbar | Выпадающие списки |
| ProductGallery | Swiper carousel, zoom |
| ProductInfo | Выбор размера/цвета, add-to-cart |
| CartPage (all) | Управление состоянием корзины |
| CheckoutPage (all) | Формы, валидация |
| AuthModals | Формы авторизации |
| AccountForms | Формы профиля |
| Modal, Quantity, Input, Select | Интерактивные UI-элементы |

### Компоненты для миграции на Server Components

Статические/контентные компоненты, которые можно перевести на async Server Components:

| Компонент/Страница | Приоритет | Подход |
|---|---|---|
| `/catalog` (page.tsx) | HIGH | Async page → `getCategories()` → pass to client grid |
| `/catalog/[slug]` (page.tsx) | HIGH | Async page → `getProductBySlug()` → pass to client ProductInfo |
| `/collections/[slug]` (page.tsx) | HIGH | Async page → `getCollectionBySlug()` → pass to client |
| `/news` (page.tsx) | MEDIUM | Async page → `getArticles()` → pass to client tabs |
| `/news/[slug]` (page.tsx) | MEDIUM | Async page → `getArticleBySlug()` → render static |
| `/about` (page.tsx) | MEDIUM | Async page → `getAboutPage()` → render static |
| `/contacts` (page.tsx) | LOW | Async page → `getContactsPage()` → render static |
| `/cooperation` (page.tsx) | LOW | Async page → `getCooperationPage()` → render static |
| `/loyalty` (page.tsx) | LOW | Async page → `getLoyaltyPage()` → render static |
| `/info/[slug]` (page.tsx) | LOW | Async page → `getInfoPageBySlug()` → render static |
| `/special-offers` (page.tsx) | LOW | Async page → `getSpecialOffersPage()` → render static |
| `/` Home (page.tsx) | HIGH | Async page → `getHomePage()` → pass to client sections |

### Паттерн миграции

```typescript
// До — Client Component с моковыми данными
"use client";
import { catalogProducts } from "@/data/catalog";

export default function CatalogPage() {
  return <CatalogGrid products={catalogProducts} />;
}

// После — Server Component с fetch из Strapi
import { getProducts } from "@/lib/queries/catalog";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";

export default async function CatalogPage() {
  const { data } = await getProducts();
  return <CatalogGrid products={data} />;
}
```

---

## 7. Кеширование и ревалидация

### Стратегия по типу контента

| Тип контента | Стратегия | revalidate | Обоснование |
|---|---|---|---|
| Каталог товаров | ISR | 60s | Цены/наличие меняются часто |
| Категории, коллекции | ISR | 120s | Меняются редко |
| Статические страницы (about, contacts) | ISR | 300s | Меняются очень редко |
| Корзина, заказы, профиль | SSR | no-store | Персональные данные |
| Юридические страницы | ISR | 300s | Меняются крайне редко |

### On-demand revalidation (Webhook)

Настроить в Strapi Webhook → Next.js Route Handler:

```typescript
// src/app/api/revalidate/route.ts
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret");
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json();
  const tag = body.model; // "products", "articles", etc.
  revalidateTag(tag);

  return NextResponse.json({ revalidated: true, tag });
}
```

---

## 8. Работа с медиа

### Утилита `getStrapiMediaUrl`

```typescript
import { getStrapiMediaUrl } from "@/lib/strapi";

// В компоненте:
<Image
  src={getStrapiMediaUrl(product.attributes.image.data.attributes.url)}
  alt={product.attributes.image.data.attributes.alternativeText ?? ""}
  width={400}
  height={400}
/>
```

### next.config.ts

`remotePatterns` настроены для Strapi (`localhost:1337/uploads/**`).
Для production — установить `STRAPI_MEDIA_HOSTNAME` в `.env.local`.

### Рекомендации

- Использовать Strapi Media Library для всех изображений
- Настроить responsive formats в Strapi (thumbnail, small, medium, large)
- Использовать `formats.medium` для карточек каталога, `formats.large` для hero-секций
- Перенести текущие статические изображения из `/public/assets/figma/` в Strapi Media Library

---

## 9. Аутентификация

### Strapi Users & Permissions

Для аккаунт-секции (`/account/*`) использовать Strapi Users & Permissions plugin:

1. **Регистрация**: `POST /api/auth/local/register`
2. **Вход**: `POST /api/auth/local`
3. **Профиль**: `GET /api/users/me`
4. **JWT-токен**: хранить в httpOnly cookie (через Next.js API route)

### Интеграция с AuthProviderWrapper

Текущий `AuthProviderWrapper` — заглушка. Для подключения к Strapi:

1. Создать `src/lib/auth.ts` с функциями login/register/logout
2. Хранить JWT в httpOnly cookie через Next.js Server Action
3. Обновить `AuthProviderWrapper` для проверки cookie при mount
4. Добавить middleware для защиты `/account/*` маршрутов

### Расширение User

Добавить через Strapi Admin → Content-Type Builder → User:

```
- firstName: string
- lastName: string
- phone: string
- birthDate: date
- bonuses: integer (default: 0)
- city: string
- region: string
- addresses: relation (has-many → Address)
- bonusOperations: relation (has-many → BonusOperation)
- notificationSettings: component (repeatable) → account.notification-setting
```

---

## 10. Пошаговый план внедрения

### Фаза 1: Backend (Strapi)

1. Развернуть Strapi v5 (`npx create-strapi-app@latest backend`)
2. Создать Collection Types: Product, Category, Collection, Article, Boutique, InfoPage
3. Создать Single Types: HomePage, AboutPage, ContactsPage, и т.д.
4. Создать все Reusable Components (27 штук)
5. Настроить Users & Permissions (публичный доступ к каталогу, приватный к заказам)
6. Импортировать данные из `src/data/*.ts` в Strapi
7. Загрузить медиа из `/public/assets/figma/` в Media Library
8. Создать API Token (read-only) для frontend

### Фаза 2: Frontend — контентные страницы

1. Установить зависимости: `npm install qs`
2. Настроить `.env.local`
3. Перевести статические страницы: About, Contacts, Cooperation, Loyalty, CustomerInfo, Info
4. Перевести каталог: Categories, Products, Collections
5. Перевести новости: Articles

### Фаза 3: Frontend — интерактивные страницы

1. Добавить state management: `npm install zustand`
2. Реализовать Cart Store (локальное состояние + sync с Strapi)
3. Реализовать Favorites Store
4. Подключить аутентификацию
5. Перевести Checkout на реальный API

### Фаза 4: Оптимизация

1. Настроить Webhook revalidation (Strapi → Next.js)
2. Оптимизировать изображения (убрать `unoptimized`, настроить formats)
3. Добавить `generateStaticParams` для ISG ключевых маршрутов
4. Добавить SEO-метаданные через `generateMetadata`
5. Настроить sitemap.xml (динамический через Strapi)

---

## 11. Rollback-стратегия

### При ошибках в Strapi

1. Fallback данные: сохранить `src/data/*.ts` как fallback
2. В `src/lib/strapi.ts` — try/catch с возвратом моковых данных при ошибке API
3. Health-check: проверять доступность Strapi перед deploy

### При проблемах с миграцией

1. Feature flag: env-переменная `USE_STRAPI=true|false`
2. Каждая query-функция проверяет флаг и возвращает либо Strapi-данные, либо моки
3. Постепенный rollout по страницам

```typescript
// Пример fallback-паттерна
import { getHomePage } from "@/lib/queries/home";
import { heroSlides, categories } from "@/data/home";

export async function getHomeData() {
  if (process.env.USE_STRAPI !== "true") {
    return { heroSlides, categories }; // fallback
  }

  try {
    return await getHomePage();
  } catch (error) {
    console.error("Strapi unavailable, using fallback:", error);
    return { heroSlides, categories };
  }
}
```

### Git-стратегия

- Все изменения — в отдельной ветке `feature/strapi-integration`
- PR-review перед merge в main
- Теги версий перед каждой фазой

---

## Необходимые зависимости

```bash
# Обязательные
npm install qs
npm install --save-dev @types/qs

# Для state management (Фаза 3)
npm install zustand

# Опциональные
npm install zod            # Валидация форм и API-ответов
npm install react-hot-toast # Уведомления
```
