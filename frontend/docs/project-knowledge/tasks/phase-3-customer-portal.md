# Phase 3 — Medusa-first Customer Portal

**Дата реализации:** 2026-02-28
**Статус:** ✅ Реализована (Phase 3.1, 3.2, 3.3, 3.4)

---

## Контекст

**До Phase 3:** аутентификация через Strapi JWT, личный кабинет на mock-данных (`src/data/account.ts`), checkout создавал Draft Orders через Medusa Admin API.

**Цель Phase 3:** Medusa как источник истины для commerce (auth, cart, orders, addresses). Strapi = только CMS.

---

## Phase 3.1 — Customer Auth: Strapi → Medusa

### Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `src/types/medusa.ts` | **Создан.** Типы: `MedusaAddress`, `MedusaCustomer`, `MedusaLineItem`, `MedusaOrder` |
| `src/lib/auth/server.ts` | **Переписан.** Strapi функции → Medusa (см. ниже) |
| `src/lib/auth/client.ts` | **Переписан.** `AuthUser`: `id: string`, `first_name/last_name`, `phone/company_name` |
| `src/app/api/auth/login/route.ts` | `loginWithMedusa` + `getMedusaCustomer` |
| `src/app/api/auth/register/route.ts` | `registerWithMedusa` + `getMedusaCustomer` |
| `src/app/api/auth/me/route.ts` | `getMedusaCustomer` вместо `getMeFromStrapi` |
| `src/components/auth/AuthProviderWrapper.tsx` | `onRegisterSubmit`: `first_name/last_name` вместо `username` |

### Medusa Auth API (v2)

| Действие | Endpoint | Метод |
|----------|----------|-------|
| Логин | `POST /auth/customer/emailpass` | → `{ token }` |
| Регистрация identity | `POST /auth/customer/emailpass/register` | → registration token |
| Создать customer | `POST /store/customers` (Bearer: reg token) | → customer record |
| Получить customer | `GET /store/customers/me` (Bearer: auth token) | → `{ customer }` |
| Обновить customer | `POST /store/customers/me` (Bearer: auth token) | → `{ customer }` |

### Регистрация — 3 шага

```
1. POST /auth/customer/emailpass/register → registration_token
2. POST /store/customers (Bearer: registration_token) + { first_name, last_name, email }
3. POST /auth/customer/emailpass (login) → auth_token  ← этот токен кладём в cookie
```

> **Критично:** `registration_token ≠ auth_token`. После шага 2 нужен явный логин (шаг 3).

### Auth strategy

- JWT из `/auth/customer/emailpass` → хранится в `vb_auth_token` httpOnly cookie
- Сервер проксирует как `Authorization: Bearer <token>` к Medusa Store API
- Это **JWT-in-cookie** стратегия (не полноценная Medusa session через `/auth/session`)
- Полный session flow (`POST /auth/session → connect.sid cookie`) — TODO для Phase 3.4
- Имя cookie `vb_auth_token` сохранено для backward compatibility

### Миграция пользователей

Существующие Strapi-пользователи не имеют Medusa customer accounts. При первом входе → 401 → пользователь регистрируется заново в Medusa. Strapi Users & Permissions остаётся только для CMS-доступа.

---

## Phase 3.2 — Account Pages: Profile + Orders + Addresses

### Новые API routes

| Route | Метод | Назначение |
|-------|-------|-----------|
| `/api/account/profile` | GET | `getMedusaCustomer(token)` → `{ user: MedusaCustomer }` |
| `/api/account/profile` | PATCH | `POST /store/customers/me` → обновить профиль |
| `/api/account/orders` | GET | `GET /store/orders` → `{ orders: MedusaOrder[] }` |
| `/api/account/addresses` | GET | `getMedusaCustomer(token)` → `{ addresses: MedusaAddress[] }` |
| `/api/account/addresses` | POST | `POST /store/customers/me/addresses` |

> `GET /store/orders` — **стандартный** Medusa v2 Store endpoint (подтверждено в docs). Возвращает заказы текущего customer по auth context.

### Обновлённые компоненты

| Компонент | Было | Стало |
|-----------|------|-------|
| `ProfileForm.tsx` | Mock `accountUser` | `useEffect → GET /api/account/profile`, `handleSave → PATCH` |
| `OrdersList.tsx` | `getCommerceSnapshot` + mock `orders` | `useEffect → GET /api/account/orders` + mapping `MedusaOrder → Order` |
| `AddressBook.tsx` | Mock `addresses` | `useEffect → GET /api/account/addresses`, POST для новых адресов |

### Маппинг MedusaOrder → Order (тип из @/data/account)

```typescript
status: "completed" → "Получен", "cancelled" → "Отменён", "shipped" → "В доставке", else → "Обработка"
total: Math.round(o.total / 100).toLocaleString("ru-RU") + " ₽"  // total in kopecks
image: item.thumbnail ?? "/placeholder.jpg"
```

---

## Phase 3.3 — Checkout: Medusa Cart Flow

### Новые cart routes

| Route | Метод | Назначение |
|-------|-------|-----------|
| `/api/cart/address` | PUT | Обновить `shipping_address` + `email` корзины |
| `/api/cart/shipping-options` | GET | Список опций доставки для cart_id |
| `/api/cart/shipping` | POST | Добавить shipping method к корзине |
| `/api/cart/complete` | POST | Завершить корзину → Medusa Order |

### Cart Complete Route

- Читает `medusa_cart_id` из cookie
- Если пользователь залогинен → прикрепляет Bearer token → заказ становится **customer-bound**
- Success: `{ type: "order", order: { id, display_id } }` + очищает cart cookie
- Failure: `{ type: "cart", error: "..." }` (нет shipping/payment provider в Medusa)

### Checkout Submit Flow

```
1. PUT /api/cart/address           → sync email + shipping_address
2. POST /api/cart/complete         → { type: "order", order }
   └─ Success: orderId = order.id
   └─ Failure: fallback к Legacy Draft Orders
3. [Fallback] POST /api/commerce/orders  → Draft Orders (Admin API)
4. Fire-and-forget: POST /api/delivery/order (CDEK)
5. If online payment: POST /api/payment/create → redirect /checkout/payment
6. Else: redirect /checkout/success?orderId=...
```

### Legacy Draft Orders Fallback

Временный fallback на период до настройки Medusa shipping/payment providers.

**TODO:** После настройки провайдеров:
1. Убедиться что `POST /api/cart/complete` возвращает `type: "order"`
2. Удалить блок `// ── Fallback: Legacy Draft Orders ──` из `checkout/page.tsx`
3. Удалить route `/api/commerce/orders` (или оставить для историч. совместимости)

---

## Phase 3.4 — Бонусная система + Cart Transfer + Session Upgrade

**Дата реализации:** 2026-02-28

### 3.4.1 — Guest Cart Transfer после логина

После успешного логина или регистрации, если в cookie есть `medusa_cart_id`, вызываем
`POST /store/carts/:cartId` с Bearer-токеном. Medusa ассоциирует анонимную корзину с customer.
Вызов fire-and-forget (`.catch(() => {})`), никогда не блокирует ответ логина.

**Изменённые файлы:**
- `src/lib/auth/server.ts` — добавлен `transferCartToCustomer(cartId, authToken)`
- `src/app/api/auth/login/route.ts` — читает `medusa_cart_id` cookie → вызывает transfer
- `src/app/api/auth/register/route.ts` — то же

### 3.4.2 — Бонусная система через Medusa metadata

Бонусы хранятся в `customer.metadata.bonus_balance` (целое число рублей, 1 бонус = 1 ₽).
Начисление: 5% от итоговой суммы заказа после оформления (fire-and-forget из checkout).

**Новые файлы:**
- `src/app/api/account/bonuses/route.ts`
  - `GET` — `getMedusaCustomer(token)` → `{ balance: customer.metadata.bonus_balance ?? 0 }`
  - `POST { earnedAmount }` — читает текущий баланс, вызывает `POST /admin/customers/:id { metadata: { bonus_balance: N } }`
  - Graceful stub: если нет `MEDUSA_ADMIN_EMAIL/PASSWORD` → `{ ok: true, stub: true }`

**Admin API auth pattern** (тот же что в `commerce/orders/route.ts`):
```
POST /auth/user/emailpass → { token }  ← кэшируется 23 часа, module-level variable
POST /admin/customers/:id (Bearer: admin token) → обновляет metadata
```

**Обновлённые компоненты:**
- `src/components/account/LoyaltySection.tsx` — заменён `accountUser.bonuses` mock на `GET /api/account/bonuses`
- `src/components/account/DashboardCards.tsx` — добавлен `"use client"`, реальный баланс из API
- `src/app/checkout/page.tsx` — `availableBonuses` из API, начисление после создания заказа

### 3.4.3 — Session Upgrade (JWT → connect.sid)

После логина/регистрации: JWT → `POST /auth/session` (Bearer: JWT) → `connect.sid` из Set-Cookie
→ сохраняется в `vb_session` httpOnly cookie. Запросы к Medusa Store предпочитают `connect.sid`
над Bearer JWT.

**Добавлено в `src/lib/auth/server.ts`:**
```typescript
export const SESSION_COOKIE_NAME = "vb_session";
export async function getSessionCookieValue(): Promise<string | undefined>;    // читает vb_session cookie
export async function exchangeJwtForSession(jwt): Promise<string | undefined>; // POST /auth/session
export async function transferCartToCustomer(cartId, authToken): Promise<void>;
```

**Добавлено в `src/lib/medusa.ts`:**
```typescript
export function getMedusaStoreHeaders(options?: { sessionValue?: string; authToken?: string }): Record<string, string>
// Приоритет: connect.sid cookie > Bearer JWT > только publishable key
```

**Обновлённые routes (используют getMedusaStoreHeaders):**
- `src/app/api/account/profile/route.ts` (PATCH)
- `src/app/api/account/orders/route.ts` (GET)
- `src/app/api/account/addresses/route.ts` (POST)
- `src/app/api/cart/address/route.ts` (PUT)
- `src/app/api/cart/complete/route.ts` (POST)
- `src/app/api/auth/logout/route.ts` — очищает и `vb_auth_token`, и `vb_session`

### Типы
- `src/types/medusa.ts` — добавлено `metadata?: Record<string, unknown>` к `MedusaCustomer`

---

## Замечания и известные ограничения

### Admin credentials для бонусов

`POST /api/account/bonuses` (earn) требует `MEDUSA_ADMIN_EMAIL` + `MEDUSA_ADMIN_PASSWORD` в env.
Без них работает в stub-режиме (`{ ok: true, stub: true }`) — бонусы не сохраняются в Medusa, но логин/регистрация не падают.

### Unit-тесты admin-path (bonuses)

Тесты не покрывают реальный `POST /admin/customers/:id` — `ADMIN_EMAIL`/`PASSWORD` читаются как module-level constants при загрузке модуля, что делает мокирование env сложным. Путь покрывается e2e-тестами.

---

## Верификация

### Phase 3.1
1. `POST /api/auth/register { email, password, first_name, last_name }` → 200, cookie `vb_auth_token` set
2. `POST /api/auth/login { identifier, password }` → 200, cookie set
3. `GET /api/auth/me` → `{ user: { id: "cus_...", email, first_name, ... } }`
4. `POST /api/auth/logout` → cookie cleared

### Phase 3.2
5. `GET /api/account/profile` (с cookie) → реальный customer из Medusa
6. `PATCH /api/account/profile { first_name: "Новое" }` → 200 → GET подтверждает изменение
7. `GET /api/account/orders` → `{ orders: [] }` (пока нет завершённых заказов)

### Phase 3.3
8. Checkout → submit → `PUT /api/cart/address` → `POST /api/cart/complete`
9. Если Medusa настроена → `{ type: "order" }` → redirect `/checkout/success?orderId=order_...`
10. Если не настроена → fallback Draft Order → redirect `/checkout/success?orderId=draft_...`

### Phase 3.4
11. `POST /api/auth/login` → cookie `vb_session` установлена (если `/auth/session` вернул `connect.sid`)
12. `GET /api/account/bonuses` (без токена) → `{ balance: 0 }`
13. `GET /api/account/bonuses` (с токеном) → `{ balance: N }` из `customer.metadata.bonus_balance`
14. `POST /api/account/bonuses { earnedAmount: 100 }` → `{ ok: true, stub: true }` (без admin env) или `{ ok: true, balance: N }` (с admin env)
15. После логина + guest cart: следующий checkout → заказ привязан к customer

---

## TypeScript

- `tsc --noEmit` — чисто после каждой под-фазы ✅
- `npx vitest run` — 23 файла, 166 тестов, все зелёные ✅
- Нет `any`, нет `@ts-ignore`

---

## Связанные файлы

- Типы: `src/types/medusa.ts`
- Auth server: `src/lib/auth/server.ts`
- Auth client: `src/lib/auth/client.ts`
- Account API: `src/app/api/account/`
- Cart API: `src/app/api/cart/`
- Checkout: `src/app/checkout/page.tsx`
- Bonuses API: `src/app/api/account/bonuses/route.ts`
- Medusa helpers: `src/lib/medusa.ts` (`getMedusaStoreHeaders`)
- ADR: `frontend/docs/project-knowledge/decisions/ADR-0001-strapi-medusa-data-ownership.md`
- Аудит/роадмеп: `frontend/docs/project-knowledge/tasks/2026-02-27-frontend-audit-roadmap.md`
