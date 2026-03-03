# Phase 2.7 — CDEK Delivery Integration (stub)

**Дата:** 2026-02-28
**Статус:** Завершено
**Ветка:** feat/production-deploy

---

## Цель

Заменить захардкоженную стоимость СДЭК (390 ₽) на динамический расчёт через CDEK API v2.
Добавить создание заявки на доставку при оформлении заказа.
Stub-режим — без реальных Client ID/Secret.

---

## Новые файлы

| Файл | Описание |
|------|----------|
| `frontend/src/lib/cdek.ts` | CDEK service: OAuth token cache, calculateCdekDelivery, createCdekOrder |
| `frontend/src/app/api/delivery/calculate/route.ts` | POST — расчёт стоимости СДЭК |
| `frontend/src/app/api/delivery/order/route.ts` | POST — создание заявки СДЭК |

---

## Изменённые файлы

| Файл | Что изменилось |
|------|----------------|
| `frontend/src/components/checkout/DeliverySection.tsx` | `useEffect` → fetch `/api/delivery/calculate` при выборе СДЭК + смене города |
| `frontend/src/app/checkout/page.tsx` | `cdekPrice` state; CDEK order fire-and-forget в handleSubmit |
| `docker-compose.yml` | `CDEK_CLIENT_ID`, `CDEK_CLIENT_SECRET`, `CDEK_FROM_CITY_CODE` в frontend |

---

## Архитектура

```
DeliverySection (client)
  selectedMethod = "cdek" + city изменился
    → useEffect → POST /api/delivery/calculate { toCity }
        → cdek.ts: calculateCdekDelivery(toCity)
            stub: { price: 390, periodMin: 3, periodMax: 5 }
            real: OAuth → POST /v2/calculator/tarifflist → тариф 136
        ← { price, periodMin, periodMax }
    → показывает "390 ₽ · 3–5 дн." или реальную цену
    → onCdekPriceUpdate(price) → checkout/page.tsx: setCdekPrice(price)
        → deliveryCost использует cdekPrice вместо hardcode 390

checkout/page.tsx handleSubmit:
  → ... (Medusa Draft Order) ...
  → if deliveryMethod === "cdek":
      void fetch("/api/delivery/order", { orderId, toAddress, toCityId, ... })
          → cdek.ts: createCdekOrder(...)
              stub: { cdekUuid: "cdek_stub_xxx", status: "accepted" }
              real: OAuth → POST /v2/orders → CDEK UUID
      (fire-and-forget — не блокирует checkout)
  → ... payment fork (Phase 2.6) ...
```

---

## CDEK API v2 details

**Auth:** `POST /oauth/token` → Bearer token (кэш 55 минут)
**Calculate:** `POST /v2/calculator/tarifflist` (тариф 136 — «Посылка склад-дверь»)
**Create order:** `POST /v2/orders`

### Маппинг городов

| account.ts ID | CDEK code | Город |
|---------------|-----------|-------|
| `msk` | 44 | Москва |
| `spb` | 137 | Санкт-Петербург |
| `tvr` | 717 | Тверь |
| `kzn` | 270 | Казань |
| `nsk` | 399 | Новосибирск |
| `ekb` | 2686 | Екатеринбург |

### Параметры посылки (default)

- Вес: 1000 г (1 кг)
- Размеры: 30×20×10 см
- Склад отправки: Москва (code 44)

---

## Graceful fallback

1. **CDEK API недоступен** → `calculateCdekDelivery` возвращает `{ price: 390, ... }` без ошибки
2. **Ошибка создания заявки** → fire-and-forget, ошибка логируется, checkout продолжается
3. **Сеть недоступна во frontend** → `useEffect` в DeliverySection не меняет `cdekPrice` → остаётся дефолтный 390

---

## Активация реальных доставок

```env
CDEK_CLIENT_ID=ваш_client_id
CDEK_CLIENT_SECRET=ваш_client_secret
CDEK_FROM_CITY_CODE=44        # код города отправки (Москва = 44)
CDEK_FROM_ADDRESS=г. Москва   # адрес склада (для заявок)
```

После установки env vars — перезапустить frontend-контейнер.

---

## TypeScript

- `tsc --noEmit` проходит чисто
- Нет `any`, нет `@ts-ignore`
- `DeliverySection.tsx` использует `"use client"` (useEffect) — допустимо
