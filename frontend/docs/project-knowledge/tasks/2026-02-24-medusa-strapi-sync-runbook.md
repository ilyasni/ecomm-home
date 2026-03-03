# Medusa-Strapi Sync Runbook

## Context

Нужно внедрить устойчивую интеграцию `Medusa` (commerce master) и `Strapi` (content master) без двойного владения данными.

## Problem / Goal

- Обеспечить единый источник истины для товаров, заказов и пользователей.
- Исключить сценарии рассинхрона между CMS и commerce backend.
- Обеспечить воспроизводимый операционный процесс внедрения и поддержки синка.

## Solution

- Принят ADR: `frontend/docs/project-knowledge/decisions/ADR-0001-strapi-medusa-data-ownership.md`.
- Реализуется событийная синхронизация Medusa -> Strapi только для проекций/ссылок.
- Коммерческие операции storefront идут только через Medusa API.

## Implementation Notes

### 1) Подготовка и контракты

- Зафиксировать ownership matrix (что хранится в Medusa, что в Strapi).
- Утвердить event contract: тип события, version, payload, idempotency key.
- Добавить feature flag `ENABLE_MEDUSA_STRAPI_SYNC`.

### 2) Слой синхронизации

- Подписчики в Medusa на `product.*`, `variant.*`, `price.*`, `inventory.*`.
- Воркеры обработки событий:
  - transform -> validate -> upsert в Strapi;
  - retry policy + DLQ;
  - структурные логи и correlation id.
- Поля связи в Strapi: `medusa_product_id`, `medusa_variant_id`, `medusa_collection_id`.

### 3) Витрина (BFF aggregation)

- Коммерческие блоки (цена, наличие, покупка, корзина, заказ) — только из Medusa.
- Контентные блоки (rich sections, SEO, editorial banners) — из Strapi.
- На уровне BFF исключить fallback на Strapi для commerce-полей.

### 4) Reconciliation

- Ежедневный job:
  - проверка наличия Strapi-проекций для активных продуктов Medusa;
  - проверка orphan-записей в Strapi;
  - отчёт о дрейфе.

## Checks

- Smoke:
  - create/update product в Medusa -> проекция появилась/обновилась в Strapi;
  - изменение цены/остатка отображается в storefront без участия Strapi.
- Negative:
  - при недоступном Strapi commerce checkout продолжает работать;
  - события попадают в retry/DLQ и не теряются.
- Consistency:
  - reconciliation report без критичных расхождений.

## Impact / Rollback

- **Impact:** изменяется операционная модель интеграции и контракты данных между сервисами.
- **Риски:** некорректная трансформация событий, задержки доставки, временная неконсистентность проекций.
- **Rollback:**
  1. Выключить `ENABLE_MEDUSA_STRAPI_SYNC`.
  2. Переключить storefront на Medusa-only для commerce блоков.
  3. Повторно прогнать синк из checkpoint после восстановления.

## Links

- ADR: `frontend/docs/project-knowledge/decisions/ADR-0001-strapi-medusa-data-ownership.md`
- Интеграционный документ: `frontend/docs/strapi-integration.md`
- Архитектурный baseline: `frontend/docs/open-source-architecture-roadmap.md`
