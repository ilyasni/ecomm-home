# Phase 2.4: Промокоды → Medusa Promotions API

**Статус:** Завершено
**Дата:** 2026-02-27

## Что сделано

Промокоды теперь хранятся в Medusa и проверяются через server-side API route.
Убран хардкод `vita10` из `cart/page.tsx`.

## Ключевые файлы

| Файл | Описание |
|------|----------|
| `tmp_migration/create-medusa-promotions.mjs` | Идемпотентный скрипт создания промокодов |
| `src/app/api/cart/promo/route.ts` | POST — валидация кода через Medusa Admin API |
| `src/app/cart/page.tsx` | async-обработчик, убран mock-словарь |
| `docker-compose.yml` | Добавлены `MEDUSA_ADMIN_EMAIL/PASSWORD` во frontend env |
| `frontend/.env` | Добавлены Medusa admin credentials для локальной разработки |

## Активные промокоды в Medusa

| Код | Скидка | Тип |
|-----|--------|-----|
| VITA10 | 10% | percentage, order |
| VITA15 | 15% | percentage, order |
| VITA20 | 20% | percentage, order |

Управление через Medusa Admin: `http://localhost:9000/app → Promotions`

## Архитектура API route

```
POST /api/cart/promo { code }
  → getMedusaAdminToken()        // кэш ~23ч
  → GET /admin/promotions?code[]=VITA10
  → filter: status === "active"
  → return { valid, code, discount: { type, value } }
```

**Кэш токена**: в памяти процесса Next.js, сбрасывается при рестарте.

## Medusa Promotions API (v2)

### Создание промокода
```json
POST /admin/promotions
{
  "code": "VITA10",
  "type": "standard",
  "application_method": {
    "type": "percentage",  // или "fixed"
    "target_type": "order",
    "value": 10
  }
}
```
После создания нужно активировать: `POST /admin/promotions/{id} { "status": "active" }`.

**Примечание**: `allocation: "each"` требует `max_quantity` — для order-уровневых скидок опускать.

### Query по коду
```
GET /admin/promotions?code[]=VITA10
```
Возвращает массив `promotions`. Фильтровать по `status === "active"`.

### Значение скидки
Хранится в `application_method.raw_value.value` (string).

## Следующий шаг

Phase 2.5: Checkout → Medusa Order (создание заказа из cart items)
