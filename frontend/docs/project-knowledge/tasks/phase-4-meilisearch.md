# Phase 4 — Meilisearch: полнотекстовый поиск

**Дата реализации:** 2026-02-28
**Статус:** ✅ Реализована (4.1–4.4)

---

## Контекст

**До Phase 4:** `searchProducts()` использовала Strapi `$containsi` (PostgreSQL ILIKE) — медленно, нет релевантности, нет фасетов.

**Цель Phase 4:** Meilisearch как поисковый движок. Strapi остаётся источником данных (через reindex-route). Graceful fallback к Strapi если Meilisearch недоступен.

---

## Что реализовано

### 4.1 — Meilisearch в docker-compose.yml

Добавлен сервис `meilisearch` (порт 7700, volume `meilisearch_data`).
Новые env в `frontend`:
- `MEILISEARCH_URL=http://meilisearch:7700`
- `MEILISEARCH_MASTER_KEY=${MEILI_MASTER_KEY}`
- `REINDEX_SECRET=${REINDEX_SECRET}`

```yaml
meilisearch:
  image: getmeili/meilisearch:v1.6
  environment:
    MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
    MEILI_ENV: development
  ports:
    - "7700:7700"
  volumes:
    - meilisearch_data:/meili_data
```

> Фронтенд НЕ зависит от meilisearch через `depends_on` — graceful fallback к Strapi при недоступности.

### 4.2 — `src/lib/meilisearch.ts`

Минимальный клиент на `fetch` (без npm-пакета).

**Экспорты:**
| Функция / константа | Назначение |
|---------------------|-----------|
| `isMeilisearchConfigured()` | `true` если оба env заданы |
| `meiliSearchProducts(options)` | `POST /indexes/products/search` → `MeiliSearchResult` |
| `meiliIndexProducts(docs[])` | `POST /indexes/products/documents` → `{ taskUid }` |
| `meiliConfigureIndex()` | Создаёт индекс + настраивает атрибуты |
| `MeiliProduct` | Тип документа в индексе |
| `MeiliSearchResult` | Тип ответа поиска (включая facetDistribution) |

**Индекс `products` — конфигурация:**
- `searchableAttributes`: `title`, `description`, `sku`, `fabric`, `color`
- `filterableAttributes`: `fabric`, `density`, `size`, `color`, `badge`
- `sortableAttributes`: `price`

### 4.3 — `src/lib/queries/search.ts`

`searchProducts(query, page, pageSize, facetFilters?)` — добавлен Meilisearch path:

```
isMeilisearchConfigured()
  ├─ true  → meiliSearchProducts(...) → нормализует ответ в SearchResult
  │           └─ при ошибке: console.warn + fallthrough к Strapi
  └─ false → strapiFind ($containsi) ← старое поведение
```

Добавлен тип `SearchResult` (унифицирует Meilisearch и Strapi ответы):
```typescript
interface SearchResult {
  data: Record<string, unknown>[];
  meta: { pagination: { page, pageSize, total } };
}
```

Добавлен параметр `facetFilters?: string[][]` (формат Meilisearch: `[["fabric:Сатин"], ["color:Белый"]]`). При fallback к Strapi — игнорируется.

### 4.4 — `src/app/api/admin/search/reindex/route.ts`

`GET /api/admin/search/reindex?secret=<REINDEX_SECRET>`

**Поток:**
```
1. Проверка secret (401 если не совпадает)
2. Проверка isMeilisearchConfigured() (503 если не настроен)
3. meiliConfigureIndex() → создать/обновить настройки индекса
4. Постраничная загрузка всех products из Strapi (pageSize=100)
5. Маппинг Strapi product → MeiliProduct
6. meiliIndexProducts(documents) → { taskUid }
7. Ответ { ok: true, indexed: N, taskUid }
```

**Защита:** только query-param `secret`. В production рекомендуется вызывать из CI/CD после деплоя CMS.

---

## Env переменные (добавить в .env)

```env
# Meilisearch
MEILI_MASTER_KEY=your-strong-master-key-here

# Reindex endpoint protection
REINDEX_SECRET=your-reindex-secret-here
```

---

## Первый запуск (Setup)

```bash
# 1. Запустить Meilisearch
docker-compose up meilisearch

# 2. Проиндексировать продукты (после того как CMS заполнена данными)
curl "http://localhost:3000/api/admin/search/reindex?secret=your-reindex-secret-here"
# → { "ok": true, "indexed": 42, "taskUid": 1 }

# 3. Проверить поиск
curl "http://localhost:3000/search?q=полотенце"
```

---

## Фасетная фильтрация в поиске ✅ (Phase 4A, 2026-02-28)

`searchProducts()` принимает `facetFilters?: string[][]` и передаёт в Meilisearch.

### Реализовано (4A):
- `FiltersPanel` — добавлены `initialValues` + `onApply` пропсы; синхронизация с URL при открытии
- `SearchPageClient.tsx` — client-компонент: `router.push` при применении фильтров, `CatalogFilters` с тегами активных фильтров + удалением
- `search/page.tsx` — читает `fabric`, `density`, `size`, `color` из URL params → строит `facetFilters` → передаёт в `searchProducts()`

**URL-формат:** `/search?q=шёлк&fabric=Сатин&fabric=Шёлк&color=Белый`
- AND между разными полями, OR внутри одного поля (стандарт Meilisearch)
- Фильтры сохраняются при новом поиске (hidden inputs в form)

**Что осталось:**
- Показывать счётчики фасетов из `facetDistribution` в FiltersPanel (опционально)
- Sync Strapi webhooks → автоматический reindex при изменении продукта (Phase 4B)

---

## TypeScript

- `tsc --noEmit` — чисто ✅
- `npx vitest run` — 23 файла, 166 тестов, все зелёные ✅
- Нет `any`, нет `@ts-ignore`

---

## Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `docker-compose.yml` | Добавлен сервис `meilisearch` + env в frontend + volume |
| `src/lib/meilisearch.ts` | **Создан.** Meilisearch клиент (search + index + configure) |
| `src/lib/queries/search.ts` | `searchProducts()` — Meilisearch path + Strapi fallback + `SearchResult` тип |
| `src/app/api/admin/search/reindex/route.ts` | **Создан.** Ручной reindex endpoint |
| `src/components/catalog/FiltersPanel.tsx` | + `initialValues`, `onApply` пропсы; sync с URL при открытии |
| `src/app/search/SearchPageClient.tsx` | **Создан.** Client-компонент поиска с router.push + CatalogFilters |
| `src/app/search/page.tsx` | Читает filter URL params → facetFilters → searchProducts() |
