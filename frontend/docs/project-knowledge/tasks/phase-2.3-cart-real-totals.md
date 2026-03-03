# Phase 2.3: Cart — реальные суммы заказа

**Статус:** Завершено
**Дата:** 2026-02-27

## Что сделано

Убраны захардкоженные суммы из страницы корзины (`64 000 ₽`, `- 4 000 ₽`, `60 000 ₽`).
Добавлены динамические расчёты и foundation для Medusa Cart API.

## Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `src/app/cart/page.tsx` | `OrderSidebar` — реальные суммы из props; promo validation |
| `src/app/api/cart/route.ts` | GET/POST — Medusa Cart (create/get), httpOnly cookie |
| `src/app/api/cart/items/route.ts` | POST — add line item to Medusa Cart |

## Логика OrderSidebar

```
subtotal = sum(item.price × item.quantity)  // из CartPage
promoDiscount = subtotal × rate              // если применён промокод
total = subtotal - promoDiscount
bonusesAccrued = total × 0.05               // 5% программа лояльности
```

`OrderSidebar` принимает `subtotal: number` от родителя и вычисляет всё остальное локально.

## Промокоды

Временный mock-словарь `VALID_PROMO_CODES: Record<string, number>` в `cart/page.tsx`:
- `vita10` → скидка 10%
- Будет заменён на Medusa Promotions API в Phase 2.4

### UX промокода:
- Кнопка "→" применяет код
- Enter в поле тоже применяет
- Показывает зелёный/красный feedback
- При успехе: строка скидки появляется в итогах

## Medusa Cart API routes

### `GET /api/cart`
- Читает `medusa_cart_id` из httpOnly cookie
- Возвращает `{ cart: MedusaCart | null }`

### `POST /api/cart`
- Создаёт Medusa cart с RUB регионом
- Сохраняет `medusa_cart_id` в httpOnly cookie (7 дней)
- Body опционально: `{ region_id?: string }`

### `POST /api/cart/items`
- Добавляет `variant_id` в Medusa cart
- Создаёт cart если не существует
- Body: `{ variant_id: string; quantity?: number }`

## Ограничения (Phase 2.5)

- Текущие items в localStorage не синхронизируются с Medusa cart автоматически
- `CommerceCartItem` не хранит `variantId` — нужно обновить product pages (Phase 2.5)
- Checkout должен создать Medusa cart из localStorage items перед оформлением

## Следующие шаги

- Phase 2.4: `POST /api/cart/promo` → Medusa Promotions API (убрать mock `vita10`)
- Phase 2.5: Checkout → создать Medusa Order из cart items
