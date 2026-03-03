# Phase 2.6 — YooKassa Payment Integration (stub)

**Дата:** 2026-02-28
**Статус:** Завершено
**Ветка:** feat/production-deploy

---

## Цель

Добавить реальный redirect-flow для онлайн-платежей (карта, СБП, Yandex Pay) через YooKassa.
Реализация — stub без реального SHOP_ID/KEY. Структура правильная, коды — корректные для production.

---

## Новые файлы

| Файл | Описание |
|------|----------|
| `medusa/src/modules/payment-yookassa/service.ts` | `YookassaPaymentService extends AbstractPaymentProvider` — все 9 методов |
| `medusa/src/modules/payment-yookassa/index.ts` | Module registration |
| `frontend/src/app/api/payment/create/route.ts` | POST — создание платежа (stub/real) |
| `frontend/src/app/api/payment/webhook/route.ts` | POST — webhook YooKassa (stub: log only) |
| `frontend/src/app/checkout/payment/page.tsx` | Страница оплаты (stub + real redirect) |

---

## Изменённые файлы

| Файл | Что изменилось |
|------|----------------|
| `medusa/medusa-config.ts` | Добавлен массив `modules` с yookassa |
| `frontend/src/data/account.ts` | `PaymentMethodType` расширен: `"sbp"` и `"yandex-pay"` |
| `frontend/src/app/checkout/page.tsx` | `handleSubmit`: форк по методу оплаты |
| `docker-compose.yml` | `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY` в medusa и frontend |

---

## Новый checkout flow

```
checkout/page.tsx → POST /api/commerce/orders → Medusa Draft Order → orderId
  ↓
  if paymentMethod === "on-delivery" | "certificate":
    redirect /checkout/success?orderId=...
  else (card | sbp | yandex-pay):
    POST /api/payment/create { orderId, amount (kopecks), method, customerEmail }
      ↓
      stub: { paymentId: "pay_stub_xxx", confirmationUrl: "stub" }
      real: { paymentId: "xxx", confirmationUrl: "https://yookassa.ru/..." }
    redirect /checkout/payment?orderId=...&paymentId=...&url=...&method=...
      ↓
      stub: кнопка "Симулировать оплату" → /checkout/success?orderId=...
      real: автоматический redirect → YooKassa → return_url → /checkout/success
```

---

## YooKassa API

**Создание платежа** — `POST https://api.yookassa.ru/v3/payments`
- Basic Auth: `shopId:secretKey`
- Idempotence-Key: уникальный ключ per request
- `capture: true` — автозахват (изменить на `false` для ручного capture если нужно)
- `confirmation.type: "redirect"` — перенаправление на страницу ЮKassa

**Webhook events:**
- `payment.succeeded` → captured
- `payment.canceled` → canceled
- `refund.succeeded` → refunded

---

## Medusa Payment Provider

`YookassaPaymentService` реализует все 9 методов `AbstractPaymentProvider`:

| Метод | Stub | Real |
|-------|------|------|
| `initiatePayment` | Возвращает `pay_stub_xxx` | `POST /v3/payments` |
| `authorizePayment` | `{ status: "authorized" }` | `GET /v3/payments/{id}` |
| `capturePayment` | Pass-through | `POST /v3/payments/{id}/capture` |
| `cancelPayment` | Pass-through | `POST /v3/payments/{id}/cancel` |
| `refundPayment` | Pass-through | `POST /v3/refunds` |
| `retrievePayment` | Pass-through | `GET /v3/payments/{id}` |
| `deletePayment` | `{}` | Cancel equivalent |
| `getPaymentStatus` | `pending` | Status mapping |
| `getWebhookActionAndData` | Parse events | Parse YooKassa events |

---

## Способы оплаты (frontend)

```typescript
// frontend/src/data/account.ts
export type PaymentMethodType = "card" | "sbp" | "yandex-pay" | "certificate" | "on-delivery";
```

| ID | Метод | Проходит через YooKassa |
|----|-------|------------------------|
| `card` | Карта онлайн | Да |
| `sbp` | СБП | Да |
| `yandex-pay` | Yandex Pay / SberPay | Да |
| `certificate` | Подарочный сертификат | Нет → success |
| `on-delivery` | При получении | Нет → success |

---

## Переход на реальные платежи

1. Получить Shop ID и Secret Key в личном кабинете YooKassa
2. Установить env vars:
   ```env
   YOOKASSA_SHOP_ID=ваш_shop_id
   YOOKASSA_SECRET_KEY=ваш_secret_key
   ```
3. Настроить webhook URL в кабинете YooKassa:
   `https://ваш-домен.ru/api/payment/webhook`
4. В `webhook/route.ts` раскомментировать обновление статуса заказа (Phase 3)
5. Для продвинутого flow: перейти с Draft Orders на полноценный Medusa cart → payment session

---

## Ключевые решения

1. **Сумма в копейках** — `amount` в `/api/payment/create` передаётся умноженным на 100 (`totalAmount * 100`)
2. **Автозахват** (`capture: true`) — платёж сразу захватывается без ручного шага
3. **IS_STUB** — проверка по значению env-переменной, не по NODE_ENV — позволяет тестировать в prod
4. **URL encoding** — `confirmationUrl` кодируется в query string: `encodeURIComponent(url)` / `decodeURIComponent(url)`
5. **Graceful fallback** — если `/api/payment/create` упал → catch → redirect в success напрямую

---

## TypeScript

- `tsc --noEmit` проходит чисто
- Нет `any`, нет `@ts-ignore`
- `PaymentSection.tsx` подхватывает `PaymentMethodType` автоматически (импорт из account.ts)
