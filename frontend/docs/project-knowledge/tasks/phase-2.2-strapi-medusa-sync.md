# Phase 2.2: Sync Strapi → Medusa

**Статус:** Завершено
**Дата:** 2026-02-27

## Что сделано

Настроена первичная синхронизация 72 продуктов из Strapi в Medusa v2.
Каждый продукт получил `medusa_product_id` в Strapi для двустороннего связывания.

## Ключевые файлы

| Файл | Описание |
|------|----------|
| `cms/src/api/product/content-types/product/schema.json` | Добавлено поле `medusa_product_id: string` |
| `tmp_migration/sync-strapi-to-medusa.mjs` | Sync-скрипт (идемпотентный, dry-run поддерживается) |

## Как работает синхронизация

```
Strapi products (paginated, 100/page)
  → filter: publishedAt[$notNull], no medusa_product_id yet
  → createMedusaProduct(): POST /admin/products
      { title, handle=slug, options, variants (по sizes или Default), sales_channels }
  → updateStrapiProduct(): PUT /api/products/{documentId}
      { data: { medusa_product_id } }
```

### Медуза: структура продукта

- **options**: `[{ title: "Размер", values: [...labels] }]` для товаров с размерами
  или `[{ title: "Default", values: ["Default"] }]` для однотипных товаров
- **variants**: каждый с `sku`, `prices`, `manage_inventory: false`
- **sales_channels**: `[{ id: "sc_01KJG7S26GVTEGVPFNCR7FSH74" }]` (Vita Brava Home)
- **цена**: в копейках (`price * 100`), `currency_code: "rub"`

### Strapi: важные особенности v5

- `PUT /api/products/{documentId}` — использует `documentId` (UUID), **не числовой `id`**
- Поле `medusa_product_id` должно быть в схеме + CMS перезапущен, иначе 404

## Результат

| Показатель | Значение |
|------------|---------|
| Продуктов синхронизировано | 72 / 72 |
| Medusa продуктов создано | 72 |
| Strapi продуктов обновлено | 72 |
| Ошибок | 0 |

## Известные проблемы и решения

### 1. "Product options are not provided"
**Причина:** Medusa v2 требует обязательно поле `options` при создании продукта с вариантами.
**Решение:** Добавить `options: [{ title: "Размер", values: [...] }]` и маппинг в каждом variant.

### 2. Strapi PUT возвращает 404
**Причина:** Strapi 5 использует `documentId` (UUID) для роутинга, не числовой `id`.
**Решение:** Заменить `PUT /api/products/{id}` → `PUT /api/products/{documentId}`.

### 3. SKU конфликт при дубликатах size.value
**Причина:** Некоторые размеры имеют одинаковый `value` при разных `label`
(например: `value: "высота 30 см", label: "160×200 см"` и `label: "180×200 см"`).
**Решение:** Отслеживать `seenValues` — при дубликате использовать `v{index}` как suffix.

### 4. "медуза_product_id" — CMS restart
После добавления поля в `schema.json` нужен `docker compose restart cms`.
Без рестарта Strapi не распознаёт новое поле и возвращает 404.

## Запуск синхронизации

```bash
# Dry-run (без записи)
node tmp_migration/sync-strapi-to-medusa.mjs --dry-run

# Реальная синхронизация (идемпотентна — пропускает уже синхронизированные)
node tmp_migration/sync-strapi-to-medusa.mjs
```

## Следующие шаги (Phase 2.3+)

- Phase 2.3: Cart → Medusa Cart API (убрать захардкоженные 64 000₽)
- Phase 2.4: Промокоды → Medusa Discounts API
- Phase 2.5: Checkout → Medusa Order
