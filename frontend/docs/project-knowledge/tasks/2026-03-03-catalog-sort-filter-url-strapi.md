# 2026-03-03 — Каталог: сортировка + фильтры + URL sync + Strapi query

## Контекст и цель

- В каталоге были разрозненные UI-элементы сортировки/фильтров без сквозной рабочей логики.
- Требовалось связать состояние каталога через URL (`searchParams`) и серверную загрузку из Strapi.
- Цель: единый поток `UI -> URL -> SSR -> Strapi -> рендер` для категорий и страницы комплектов.

## Принятое решение

- Введен единый контракт состояния каталога в `frontend/src/lib/catalog-filters.ts`:
  - сортировка (`sort`), пагинация (`page`, `pageSize`), фильтры (`Record<string, string[]>`);
  - парсер/нормализатор query-параметров;
  - сериализация обратно в URL;
  - преобразование фильтров в Strapi `filters[...]`.
- Серверные страницы каталога теперь читают `searchParams` и передают уже нормализованное состояние в query-слой.
- Клиентские страницы каталога управляют состоянием только через URL (single source of truth).
- Панель фильтров сделана управляемой через входные секции и значения из URL.

## Что изменено

- Query и контракт:
  - `frontend/src/lib/catalog-filters.ts` (новый)
  - `frontend/src/lib/queries/catalog.ts`
- Серверные страницы:
  - `frontend/src/app/catalog/[slug]/page.tsx`
  - `frontend/src/app/catalog/sets/page.tsx`
- Клиент и UI:
  - `frontend/src/app/catalog/[slug]/CategoryPageClient.tsx`
  - `frontend/src/app/catalog/sets/SetsCatalogClient.tsx`
  - `frontend/src/components/catalog/CatalogFilters.tsx`
  - `frontend/src/components/catalog/FiltersPanel.tsx`

## Проверка результата

- `npm run lint` (frontend) — без ошибок, есть только pre-existing warnings в несвязанных файлах.
- Ручной smoke-сценарий:
  - открыть `/catalog/<slug>?sort=price-asc&page=2` и проверить корректную SSR-загрузку;
  - применить фильтры в панели, убедиться в изменении URL и перезагрузке результатов;
  - удалить один tag-фильтр и проверить обновление URL/результатов;
  - проверить `back/forward` по истории браузера;
  - повторить базовый сценарий для `/catalog/sets`.

## Риски

- Deep-фильтры Strapi на компонентных полях (`sizes`, `colors`, `specifications`) зависят от фактического наполнения данных.
- Фильтры, приходящие из CMS `category.filters.options.href`, могут ссылаться на поля, которых нет в конкретной модели товаров.
- Для `fabric/density` применяется эвристика по текстовым полям (`composition/specifications`), а не строгая схема фасетов.

## Impact

- Затронуты страницы каталога (категории и комплекты), URL-модель состояния и преобразование параметров в Strapi.
- Потенциально меняется поведение deep-link URL и пагинации (ожидаемое изменение).

## Rollback

1. Откатить `frontend/src/lib/catalog-filters.ts` и изменения в `frontend/src/lib/queries/catalog.ts`.
2. Вернуть прежние версии:
   - `frontend/src/app/catalog/[slug]/page.tsx`
   - `frontend/src/app/catalog/sets/page.tsx`
   - `frontend/src/app/catalog/[slug]/CategoryPageClient.tsx`
   - `frontend/src/app/catalog/sets/SetsCatalogClient.tsx`
   - `frontend/src/components/catalog/CatalogFilters.tsx`
   - `frontend/src/components/catalog/FiltersPanel.tsx`
3. Временный упрощенный режим: оставить только `sort` + `page`, отключив сложные фильтры.

