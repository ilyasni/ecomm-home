# Аудит и роадмеп: Frontend + Strapi MVP → полная платформа

## Context

- Проект: e-commerce Vita Brava Home (монорепо: Next.js 16 + Strapi 5 + Medusa.js v2)
- Проведён полный аудит `frontend/src/` на предмет незавершённых компонентов, заглушек и несоответствий ТЗ
- MVP-стратегия: сначала замкнуть Frontend ↔ Strapi (контент + формы), затем вводить Medusa commerce-слой
- Medusa пока не реализована — всё commerce (корзина, заказы, аккаунт) остаётся mock до Phase 2
- Figma (node-id 2007-762): доступ закрыт (403) — для сравнения с макетами настроить Figma MCP токен

## Problem / Goal

- Зафиксировать все текущие несоответствия фронтенда относительно ТЗ и проектной архитектуры
- Определить приоритеты и последовательность реализации
- Разложить по фазам: MVP (Frontend+Strapi) → Commerce (Medusa) → Portal → Search → Email

---

# ЧАСТЬ I — Найденные несоответствия

## БЛОК 1 — Формы без submit-обработчиков (критично)

Формы отрисованы, принимают ввод, но кнопки ничего не делают.

| # | Маршрут | Компонент | Файл |
|---|---------|-----------|------|
| 1 | `/contacts` | `ContactForm` | `src/components/contacts/ContactForm.tsx` |
| 2 | `/cooperation` | `PartnershipForm` | `src/components/cooperation/PartnershipForm.tsx` |
| 3 | `/account/profile` | `ProfileForm` | `src/components/account/ProfileForm.tsx` |
| 4 | `/account/notifications` | `NotificationsForm` | `src/components/account/NotificationsForm.tsx` |
| 5 | Карточка товара | `OrderFormPanel` | `src/components/product/OrderFormPanel.tsx` |

## БЛОК 2 — Отсутствующие страницы

| # | Страница | Статус |
|---|----------|--------|
| 1 | `/gift-certificates` | Нет — `/catalog/gift-certificates` это просто категория каталога |
| 2 | `/boutiques` | Нет — ссылка «Бутики» в Header ведёт на `/contacts` |

## БЛОК 3 — Placeholder-изображения вместо реальных

| Приоритет | Где | Файл |
|-----------|-----|------|
| P1 | Hero-слайдер (главная) — все слайды | `src/components/home/Hero.tsx` |
| P2 | Меню каталога (3 места) | `src/components/catalog/CatalogMenu.tsx:151,167,493` |
| P2 | Сотрудничество — PartnerOffer | `src/components/cooperation/PartnerOffer.tsx` |
| P3 | ЛК — баннер | `src/components/account/BannerAccount.tsx` |
| P3 | Корзина + Избранное — «Ранее вы смотрели» | `recentlyViewed` из `src/data/account.ts` |
| P3 | Бутики на главной | `src/components/home/Boutique.tsx` (1 фото из 3) |
| P3 | Новости | `src/data/news.ts` (1 реальное фото, остальные — placeholder) |

## БЛОК 4 — Mock-данные без реального API

| Приоритет | Место | Проблема |
|-----------|-------|----------|
| P2 | Корзина — итоговые суммы | 64 000₽ / 60 000₽ захардкожены в `src/app/cart/page.tsx` |
| P2 | Промокод в корзине | Принимает только `"vita10"` — нет реального API |
| P2 | Checkout success | `successOrderMock` из `src/data/account.ts` — данные заказа всегда одинаковые |
| P3 | Весь личный кабинет | `src/data/account.ts` — полностью статичный mock |
| P3 | Hero тексты | `src/data/home.ts` — props уже готовы под Strapi, нужно подключить |

## БЛОК 5 — Лишние файлы в `public/`

Next.js-дефолты, не используемые в проекте — подлежат удалению:
`public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`

## БЛОК 6 — Иконки: нет scroll-варианта

`public/assets/figma/header-scroll/` не хватает: `logo.svg`, `telegram.svg`, `whatsapp.svg`.
В `src/design-system/icons/icon-map.ts` у этих иконок прописан только `default`-вариант.
При использовании `variant="scroll"` — пустой `src`.

---

# ЧАСТЬ II — Роадмеп реализации

## Phase 0 — Быстрые правки (1–2 дня, без новых зависимостей)

**0.1** Удалить 5 Next.js-дефолтных SVG из `public/`

**0.2** Дополнить scroll-иконки:
- Создать/адаптировать `logo.svg`, `telegram.svg`, `whatsapp.svg` для `header-scroll/`
- Прописать `scroll`-вариант в `src/design-system/icons/icon-map.ts`

**0.3** Минимальный UX для форм (без backend) — toast-уведомление на submit:
- `ContactForm`, `PartnershipForm`, `OrderFormPanel` → «Заявка принята»
- `ProfileForm`, `NotificationsForm` → «Данные сохранены»

---

## Phase 1 — MVP: Frontend полностью на Strapi (1–2 недели + 3–5 дней на новые страницы)

**1.1 Hero-слайдер → Strapi**
- Проверить поля `heroSlides` в `HomePage` Strapi content type (title, subtitle, imageDesktop, imageMobile, link)
- `Hero.tsx` уже принимает `slides` prop — передать данные из `getHomePage()`
- Заменить placeholder на реальные hero-фото

**1.2 Меню каталога → Strapi**
- Заменить placeholder в `CatalogMenu.tsx` (строки 151, 167, 493) на `menuImage` из Strapi Category
- Подключить через `getNavigation()` или `getCategories()`

**1.3 Форма обратной связи `/contacts` → API**
- Создать Strapi content type `ContactSubmission` (name, phone, message, createdAt)
  ИЛИ Next.js API route `POST /api/contact` → Nodemailer/SMTP
- Подключить `ContactForm.tsx`: валидация + loading state + toast

**1.4 Форма партнёрства `/cooperation` → API**
- Создать Strapi content type `PartnershipSubmission` (name, phone, email, city, createdAt)
  ИЛИ `POST /api/partnership` → email
- Подключить `PartnershipForm.tsx`

**1.5 OrderFormPanel → API**
- `POST /api/order-request` → email/CRM уведомление
- Данные: name, phone, email?, productId, variant, comment
- Подключить `OrderFormPanel.tsx`

**1.6 Страница «Бутики» `/boutiques` (3–5 дней)**
- Создать/проверить Strapi content type `Boutique`: name, address, phone, hours, coords, image
- Наполнить Strapi (3 бутика из `src/data/account.ts`)
- Создать `src/app/boutiques/page.tsx` (Server Component, ISR 300s)
- Создать `src/components/boutiques/`: карточки бутиков + карта
- Добавить `getBoutiques()` в `src/lib/queries/`
- Обновить ссылку «Бутики» в Header: `/boutiques`

**1.7 Страница «Подарочные сертификаты» `/gift-certificates` (3–5 дней)**
- Создать Strapi Single Type `GiftCertificatesPage` (hero, description, denominations, howToUse, faq)
- Создать `src/app/gift-certificates/page.tsx` (Server Component)
- Компоненты: hero, описание, выбор номинала, форма активации (UI stub)
- Логика покупки — в Phase 2 (Medusa)
- Обновить навигацию: отдельная ссылка (не через каталог)

**1.8 Реальные изображения**
- Hero desktop + mobile (минимум 1 комплект)
- Фото 3 бутиков
- Фото для статей новостей
- Фото категорий для меню каталога

---

## Phase 2 — Commerce: Medusa Integration (3–4 недели + 2–3 недели на платежи)

**2.1** Medusa v2 в `docker-compose.yml` (отдельная БД PostgreSQL)
**2.2** Sync-worker Medusa → Strapi (ADR-0001: `medusa_product_id`)
**2.3** Корзина: реальные суммы из Medusa Cart API, убрать захардкоженные значения
**2.4** Промокоды: Medusa Discounts API вместо mock `"vita10"`
**2.5** Checkout: Medusa Order creation, success page с реальными данными
**2.6** Yookassa plugin: `initiatePayment`, `capturePayment`, `refundPayment`, webhook
**2.7** Доставка: CDEK API (расчёт + заявка), обновить `DeliverySection.tsx`

---

## Phase 3 — Customer Portal: Medusa Customer API ✅ (2026-02-28)

**3.1** ✅ Auth: Medusa customer JWT → `vb_auth_token` httpOnly cookie
  - Регистрация: `POST /auth/customer/emailpass/register` → reg token → `POST /store/customers` → login
  - Логин: `POST /auth/customer/emailpass` → JWT → cookie
  - `src/lib/auth/server.ts`, `src/types/medusa.ts`, `src/app/api/auth/*`

**3.2** ✅ Профиль + адреса: `GET/PATCH /store/customers/me`, `GET/POST /store/customers/me/addresses`
  - `src/app/api/account/profile`, `src/app/api/account/addresses`
  - `ProfileForm.tsx`, `AddressBook.tsx`

**3.3** ✅ Заказы + Cart Complete flow
  - `GET /store/orders` → `src/app/api/account/orders`, `OrdersList.tsx`
  - Cart routes: `PUT /api/cart/address`, `GET /api/cart/shipping-options`, `POST /api/cart/shipping`, `POST /api/cart/complete`
  - Checkout: Medusa Cart Complete → fallback к Draft Orders (временно)

**3.4** ✅ Лояльность + Session upgrade + Cart transfer
  - Бонусная система: `customer.metadata.bonus_balance` (Medusa) + `/api/account/bonuses` (GET/POST)
  - Session flow: `POST /auth/session → connect.sid → vb_session` cookie + `getMedusaStoreHeaders()`
  - Guest cart → customer transfer: `POST /store/carts/:id` (fire-and-forget) после логина/регистрации

---

## Phase 4 — Meilisearch ✅ (2026-02-28)

**4.1** ✅ Meilisearch в `docker-compose.yml` (сервис v1.6, volume, healthcheck)
**4.2** ✅ `src/lib/meilisearch.ts` — клиент (search + index + configure), без npm-пакета
**4.3** ✅ `searchProducts()` — Meilisearch path + graceful Strapi fallback + `facetFilters` param
**4.4** ✅ `GET /api/admin/search/reindex?secret=` — ручной reindex из Strapi → Meilisearch

**TODO Phase 4 (фасеты):**
- Передавать `facetFilters` из URL query params на `/search` странице
- Подключить `FiltersPanel` к `facetDistribution` в каталоге
- Strapi webhook → автоматический reindex при изменении продукта

---

## Phase 4.5 — MinIO + Imgproxy: медиа-инфраструктура ✅ (2026-02-28)

**4.5.1** ✅ MinIO + Imgproxy в `docker-compose.yml` (сервисы, env, healthcheck, volume `minio_data`)
**4.5.2** ✅ Strapi: `@strapi/provider-upload-aws-s3` в `cms/package.json` + условный provider в `plugins.ts`
**4.5.3** ✅ Next.js `next.config.ts`: remotePatterns для MinIO + imgproxy + production hostname
**4.5.4** ✅ `src/lib/imgproxy.ts`: подписанные URL (HMAC-SHA256), graceful no-op без env
**4.5.5** ✅ `src/lib/mappers.ts`: `mapMedia/mapMediaArray` → `getImgproxyUrl()` (graceful)
**4.5.6** ✅ `nginx.coolify-fallback.conf`: блок `media.produmantech.ru` → imgproxy

**Зависимости:** Phase 1 (Strapi running), Phase 4 (понимание объёмов медиа)

---

## Phase 5 — Email & Notifications (1 неделя)

**5.1** Nodemailer + SMTP (Postfix или внешний)
**5.2** Шаблоны: подтверждение заказа, смена статуса, регистрация, восстановление пароля
**5.3** Подключить к Medusa order events и webhook Yookassa

---

## Сводный роадмеп

| Phase | Что | Зависимости |
|-------|-----|-------------|
| Phase 0 | Быстрые правки: иконки, мусор, toast | — |
| Phase 1.1–1.5 | Hero + формы → Strapi/email | Strapi running |
| Phase 1.6 | Страница бутиков | Strapi content type |
| Phase 1.7 | Страница сертификатов | Strapi content type |
| Phase 1.8 | Реальные изображения | Дизайн/фото |
| Phase 2.1–2.5 | Medusa setup + cart/checkout/orders | ✅ Done |
| Phase 2.6–2.7 | Yookassa + доставка | ✅ Done |
| Phase 3.1–3.3 | Customer portal (auth, profile, orders, cart flow) | ✅ Done |
| Phase 3.4 | Лояльность + session upgrade + cart-customer transfer | ✅ Done |
| Phase 4 | Meilisearch | ✅ Done |
| Phase 4.5 | MinIO + Imgproxy (медиа-инфраструктура) | ✅ Done |
| Phase 5 | Email | SMTP + Phase 2 |

**MVP = Phase 0 + Phase 1 (только Strapi, без Medusa) — ✅ DONE**
**Commerce baseline = Phase 2 + Phase 3.1–3.3 — ✅ DONE**

## Checks

- Аудит проведён через полное рекурсивное чтение `frontend/src/app/` и `frontend/src/components/`
- Проверены: все файлы форм, все query-функции, все mock-файлы в `src/data/`
- Проверены assets: `public/assets/figma/`, `src/design-system/icons/icon-map.ts`
- Figma: доступ закрыт (403) — ручная проверка обязательна

## Impact / Rollback

- Данный документ — только аудит и план. Изменений в коде нет.
- Каждая фаза реализуется отдельными задачами с собственными документами в `tasks/`
- При отклонении от плана — создать новый ADR или обновить этот файл

---

## Лог реализации

### Phase 0 — ЗАВЕРШЕНО (2026-02-27)

| Пункт | Статус | Файлы |
|-------|--------|-------|
| 0.1 Удалить 5 SVG из public/ | ✅ | `public/{file,globe,next,vercel,window}.svg` |
| 0.2 Scroll-иконки (logo, telegram, whatsapp) | ✅ | `public/assets/figma/header-scroll/`, `icon-map.ts` |
| 0.3 Toast + submit handlers (5 форм) | ✅ | ContactForm, PartnershipForm, ProfileForm, NotificationsForm, OrderFormPanel, Boutique |

### Phase 1 — ЗАВЕРШЕНО (2026-02-27)

| Пункт | Статус | Файлы |
|-------|--------|-------|
| 1.1 Hero → Strapi | ✅ уже было | `app/page.tsx` + `lib/queries/home.ts` |
| 1.2 Categories → Strapi | ✅ уже было | `app/page.tsx` + `lib/queries/catalog.ts` |
| 1.3 ContactForm → `/api/contact` | ✅ | `app/api/contact/route.ts`, Strapi: `contact-inquiry` |
| 1.4 PartnershipForm → `/api/partnership` | ✅ | `app/api/partnership/route.ts`, Strapi: `partnership-inquiry` |
| 1.5 OrderFormPanel → `/api/order-request` | ✅ | `app/api/order-request/route.ts`, Strapi: `order-inquiry` |
| 1.6 Страница /boutiques | ✅ | `app/boutiques/page.tsx`, `lib/queries/boutiques.ts` |
| 1.7 Страница /gift-certificates | ✅ | `app/gift-certificates/page.tsx` |
| Header: Бутики → /boutiques | ✅ | `components/home/Header.tsx` |

**Примечание по Strapi content types (1.3–1.5):**
Схемы созданы в `cms/src/api/{contact,partnership,order}-inquiry/`. После перезапуска CMS-контейнера
необходимо в Strapi Admin → Settings → API Tokens → разрешить `create` для новых типов,
или через Roles & Permissions → Public/Authenticated → enable `create`.

**Статус Phase 1.8 (реальные изображения):** ожидает загрузки фото в Strapi Media Library.

### Phase 2 — ЗАВЕРШЕНО (2026-02-28)

| Пункт | Статус | Файлы |
|-------|--------|-------|
| 2.1 Medusa v2 в docker-compose | ✅ | `docker-compose.yml` + `medusa/` |
| 2.2 Sync-worker Medusa → Strapi | ✅ stub (ADR-0001: `medusa_product_id`) | `tmp_migration/` |
| 2.3 Корзина: Cart API | ✅ | `app/api/cart/route.ts`, `app/api/cart/items/route.ts` |
| 2.4 Промокоды: Medusa Discounts API | ✅ | `app/api/cart/promo/route.ts` |
| 2.5 Checkout: Draft Orders | ✅ | `app/api/commerce/orders/route.ts` |
| 2.6 Yookassa: webhook + payment | ✅ | `app/api/payment/` |
| 2.7 CDEK: расчёт + заявка | ✅ | `app/api/delivery/`, `lib/cdek.ts` |

### Phase 3 — ЗАВЕРШЕНО (2026-02-28)

**Отклонение от исходного плана:** Phase 3.3 в роадмепе описывала только Orders.
На деле Phase 3.3 включила также полный Cart Complete flow (4 новых route).
Эндпоинт `/store/orders` (не `/store/customers/me/orders`) — стандартный Medusa v2 endpoint, подтверждено docs.
Регистрационный endpoint `/auth/customer/emailpass/register` (не `/auth/customer/emailpass`) — исправлено.

| Пункт | Статус | Файлы |
|-------|--------|-------|
| 3.1 Auth: Strapi → Medusa JWT cookie | ✅ | `lib/auth/server.ts`, `lib/auth/client.ts`, `types/medusa.ts`, `app/api/auth/*` |
| 3.2 Профиль + адреса → Medusa Store API | ✅ | `app/api/account/profile`, `app/api/account/addresses`, `ProfileForm.tsx`, `AddressBook.tsx` |
| 3.3 Заказы + Cart Complete flow | ✅ | `app/api/account/orders`, `app/api/cart/{address,shipping-options,shipping,complete}`, `checkout/page.tsx`, `OrdersList.tsx` |
| 3.4 Лояльность + session + cart transfer | ✅ | `lib/auth/server.ts` (4 новых экспорта), `lib/medusa.ts` (getMedusaStoreHeaders), `types/medusa.ts` (metadata), `app/api/account/bonuses/route.ts`, `LoyaltySection.tsx`, `DashboardCards.tsx`, `checkout/page.tsx` |

**TODO (остаток Phase 3):**
- Legacy Draft Orders fallback в `checkout/page.tsx` — убрать после настройки Medusa shipping/payment providers

**Детали:** `frontend/docs/project-knowledge/tasks/phase-3-customer-portal.md`

### Phase 4 — ЗАВЕРШЕНО (2026-02-28)

| Пункт | Статус | Файлы |
|-------|--------|-------|
| 4.1 Meilisearch в docker-compose | ✅ | `docker-compose.yml` (сервис + volume + frontend env) |
| 4.2 Meilisearch клиент | ✅ | `src/lib/meilisearch.ts` |
| 4.3 searchProducts: Meilisearch + fallback | ✅ | `src/lib/queries/search.ts` |
| 4.4 Reindex endpoint | ✅ | `src/app/api/admin/search/reindex/route.ts` |

**TODO (Phase 4 pending):** faceted filtering в CatalogFilters + Strapi webhook для авто-reindex.

**Детали:** `frontend/docs/project-knowledge/tasks/phase-4-meilisearch.md`

### Phase 4.5 — ЗАВЕРШЕНО (2026-02-28)

| Пункт | Статус | Файлы |
|-------|--------|-------|
| 4.5.1 MinIO + Imgproxy в docker-compose | ✅ | `docker-compose.yml` (2 сервиса, env cms+frontend, volume `minio_data`) |
| 4.5.2 Strapi S3 upload provider | ✅ | `cms/package.json` (+`@strapi/provider-upload-aws-s3 ^5.36.1`), `cms/config/plugins.ts` |
| 4.5.3 next.config.ts remotePatterns | ✅ | `frontend/next.config.ts` (MinIO + imgproxy + IMGPROXY_HOSTNAME) |
| 4.5.4 imgproxy.ts клиент | ✅ | `src/lib/imgproxy.ts` (HMAC-SHA256, graceful) |
| 4.5.5 mappers.ts → imgproxy | ✅ | `src/lib/mappers.ts` (mapMedia/mapMediaArray с ImgproxyOptions) |
| 4.5.6 nginx media.produmantech.ru | ✅ | `nginx.coolify-fallback.conf` (HTTP→HTTPS redirect + proxy → imgproxy) |

**Детали:** `frontend/docs/project-knowledge/tasks/phase-4.5-minio-imgproxy.md`

---

## Аудит архитектурных пробелов (2026-02-28)

Целевой стек по `open-source-architecture-roadmap.md` vs текущий `docker-compose.yml`:

| Компонент | Целевая роль | Статус | Заметка |
|-----------|-------------|--------|---------|
| **Redis** | Cache/queues (Medusa events, session) | ✅ В compose | `redis:7-alpine`, используется Medusa |
| **Nginx** | Edge/API routing, reverse proxy | ⚠️ Частично | `nginx.coolify-fallback.conf` в корне репо — для Coolify деплоя. В docker-compose нет — не нужен в dev, нужен в prod |
| **Meilisearch** | Полнотекстовый поиск + фасеты | ❌ Отсутствует | Phase 4: поиск по каталогу, фильтрация по материалу/цвету/плотности/цене |
| **MinIO** | S3-совместимое хранилище медиа | ❌ Отсутствует | Phase 4.5: замена Strapi uploads `/public/uploads` для масштабируемого медиа |
| **Imgproxy** | Динамическая оптимизация изображений | ❌ Отсутствует | Phase 4.5: ресайз/webp/lazy-load через imgproxy URL → MinIO |

### Nginx — текущее состояние

`nginx.coolify-fallback.conf` в корне репо проксирует:
- `localhost` → frontend `:3000`
- `/api/strapi` → cms `:1337`

В dev (docker-compose) роутинг работает напрямую через порты. Nginx нужен в production Coolify деплое или при вынесении сервисов на отдельный хост.

### Meilisearch — план Phase 4

```yaml
# docker-compose.yml (добавить в Phase 4)
meilisearch:
  image: getmeili/meilisearch:v1.6
  environment:
    MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
  ports:
    - "7700:7700"
  volumes:
    - meilisearch_data:/meili_data
```

Frontend: `NEXT_PUBLIC_MEILISEARCH_URL`, `NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY`.

### MinIO + Imgproxy — план Phase 4.5

```yaml
# docker-compose.yml (добавить в Phase 4.5)
minio:
  image: minio/minio:RELEASE.2024-01-01T00-00-00Z
  command: server /data --console-address ":9001"
  environment:
    MINIO_ROOT_USER: ${MINIO_ROOT_USER}
    MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
  ports:
    - "9002:9000"
    - "9001:9001"
  volumes:
    - minio_data:/data

imgproxy:
  image: darthsim/imgproxy:v3.24
  environment:
    IMGPROXY_KEY: ${IMGPROXY_KEY}
    IMGPROXY_SALT: ${IMGPROXY_SALT}
    IMGPROXY_USE_S3: "true"
    AWS_ACCESS_KEY_ID: ${MINIO_ROOT_USER}
    AWS_SECRET_ACCESS_KEY: ${MINIO_ROOT_PASSWORD}
    AWS_S3_ENDPOINT_URL: http://minio:9000
  ports:
    - "8080:8080"
```

Интеграция Strapi с MinIO: плагин `@strapi/provider-upload-aws-s3` с endpoint MinIO.

---

## Links

- ТЗ: `frontend/docs/ТЗ на верстку и программирование сайта.md`
- Архитектура: `frontend/docs/open-source-architecture-roadmap.md`
- Strapi интеграция: `frontend/docs/strapi-integration.md`
- ADR данные: `frontend/docs/project-knowledge/decisions/ADR-0001-strapi-medusa-data-ownership.md`
- Sync runbook: `frontend/docs/project-knowledge/tasks/2026-02-24-medusa-strapi-sync-runbook.md`
