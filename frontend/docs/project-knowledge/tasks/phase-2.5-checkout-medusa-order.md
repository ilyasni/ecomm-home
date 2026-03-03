# Phase 2.5 — Checkout → Medusa Order

**Дата:** 2026-02-28
**Статус:** Завершено
**Ветка:** feat/production-deploy

---

## Цель

Подключить оформление заказа к реальному Medusa Draft Orders API:
- Создавать черновик заказа в Medusa при сабмите checkout-формы
- Убрать hardcoded суммы из checkout-страницы
- Заменить mock-промокод на реальный API (тот же, что в cart)
- На странице успеха показывать данные из Medusa (если orderId — Medusa ID)

---

## Изменённые файлы

### Новые

| Файл | Описание |
|------|----------|
| `frontend/src/app/api/commerce/orders/route.ts` | **Переписан** — создание Medusa Draft Order с кастомными позициями |
| `frontend/src/app/api/commerce/orders/[id]/route.ts` | **Новый** — GET заказа из Medusa по ID |

### Изменённые

| Файл | Что изменилось |
|------|----------------|
| `frontend/src/app/checkout/page.tsx` | Реальный расчёт итогов, async promo, promoCode в submit |
| `frontend/src/components/checkout/CheckoutSidebar.tsx` | `discount` стал optional |
| `frontend/src/app/checkout/success/page.tsx` | Fetch из Medusa API + useState/useEffect |

---

## Архитектура

```
Checkout submit
  → createOrder()               → localStorage (source of truth для success)
  → POST /api/commerce/orders   → Medusa Admin: POST /admin/draft-orders
      ↓                                ↓
  data.id (dorder_xxx)          graceful fallback: { id: null }
      ↓
  redirect /checkout/success?orderId=dorder_xxx
      ↓
  OrderSummary useEffect: fetch /api/commerce/orders/dorder_xxx
      → GET /admin/draft-orders/dorder_xxx → реальные данные
      fallback: localStorage order (если id не dorder_/order_)
```

---

## Medusa Draft Orders API

**POST `/admin/draft-orders`** — создание черновика с кастомными позициями:
```json
{
  "email": "customer@example.com",
  "region_id": "reg_xxx",
  "shipping_address": { "first_name", "last_name", "address_1", "city", "country_code": "ru", "phone" },
  "items": [{ "title": "Товар", "quantity": 1, "unit_price": 120000 }],
  "metadata": { "phone", "customer_name", "payment_method", "delivery_method", "promo_code" }
}
```

**Ответ:** `{ draft_order: { id: "dorder_xxx", ... } }`

**GET `/admin/draft-orders/{id}`** — получение черновика.
**GET `/admin/orders/{id}`** — получение обычного заказа.

### Graceful fallback

Если Medusa недоступна → API route возвращает `{ id: null }`.
Checkout page: `data.id ?? localOrder.id` → redirect с localStorage ID.
Success page: если id не `dorder_`/`order_` → читает данные из localStorage.

---

## Расчёт итогов (checkout)

```tsx
const subtotal = items.reduce((sum, item) => {
  const priceNum = Number(item.price.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;
  return sum + priceNum * item.quantity;
}, 0);

const promoDiscount = appliedPromo?.type === "percentage"
  ? Math.round(subtotal * (appliedPromo.value / 100))
  : Math.min(appliedPromo?.value ?? 0, subtotal);

const deliveryCost = pickup ? 0 : courier ? 590 : 390; // СДЭК = 390

const totalAmount = subtotal - promoDiscount - bonusDiscount + deliveryCost;
const bonusEarned = Math.round(totalAmount * 0.05); // 5% бонусы
```

---

## Promo code в checkout

Заменён mock `setTimeout` → реальный async `fetch("/api/cart/promo", { code })`.
Тот же эндпоинт, что использует корзина (Phase 2.4).

---

## Ключевые решения

1. **Кастомные позиции без variant_id** — Medusa Draft Orders поддерживают title+unit_price без variant_id (через "Add custom item" в UI). В API передаём `{ title, quantity, unit_price }`.
2. **unit_price в копейках** — Medusa хранит цены в наименьшей единице валюты. "1 200 ₽" → 120 000 копеек.
3. **Admin token кэш** — тот же паттерн что в `api/cart/promo/route.ts` — 23ч кэш в памяти процесса.
4. **Success page** — `useEffect` + `useState` для async fetch; `useMemo` включает `medusaOrder` как зависимость.

---

## TypeScript

- `tsc --noEmit` проходит чисто
- Нет `any`, нет `@ts-ignore`
- `context.params: Promise<{ id: string }>` (Next.js 16 динамические роуты)
