# Icon state parity с Figma (первая итерация)

## Контекст и цель

- Задача: привести иконки и их состояния к макетам Figma c приоритетом точного визуального соответствия.
- Область: дизайн-система иконок и ключевые места UI с hover-состояниями на карточках товаров.

## Принятое решение

- Расширена карта иконок новыми состояниями/вариантами без ломки текущих вызовов `Icon`.
- Для интерактивных кнопок карточек применено явное переключение `default -> hover` через отдельные иконки.
- Для меню-хедера в состоянии открытия применена отдельная иконка `burgerActive`.

## Что изменено

- Добавлены новые имена иконок в `frontend/src/design-system/icons/icon-map.ts`:
  - `burgerActive`
  - `favoriteFilled`
  - `bagCard`
  - `bagCardHover`
- Добавлены новые SVG:
  - `frontend/public/assets/figma/icons/burger-active.svg`
  - `frontend/public/assets/figma/icons/favorite-filled.svg`
  - `frontend/public/assets/figma/icons/bag-primary.svg`
- Обновлены компоненты:
  - `frontend/src/components/catalog/ProductCard.tsx`
  - `frontend/src/components/product/ProductGallery.tsx`
  - `frontend/src/components/catalog/QuickViewModal.tsx`
  - `frontend/src/components/home/Collections.tsx`
  - `frontend/src/app/checkout/payment/page.tsx`
  - `frontend/src/components/home/Header.tsx`

## Проверка результата

- Локальный линт изменённых файлов: ошибок нет (`ReadLints`).
- Визуально проверить:
  - карточка товара: `favorite` контурная -> заливка на hover;
  - карточка товара: `bag` tertiary -> primary на hover;
  - quick-view и gallery: `favorite` меняет состояние на hover;
  - header: при открытом каталоге отображается `burgerActive`.

## Риски и rollback

- Риск: в отдельных брейкпоинтах может потребоваться точная подстройка толщины/цвета активной иконки `burgerActive`.
- Rollback:
  1. Удалить новые SVG-файлы;
  2. Вернуть `icon-map.ts` к прежним именам/маппингу;
  3. Вернуть изменения в перечисленных компонентах.

---

## Иконки раскрывающегося каталога (вторая итерация)

### Контекст

- Повторная сверка по узлам Figma `5651:132536` и `5728:117879`.
- В раскрывающемся каталоге требовалось состояние активной категории: иконка + стрелка в цвете `Primary`.

### Что изменено

- Добавлены активные SVG-варианты иконок каталога:
  - `bed-linen-active.svg`
  - `home-textile-active.svg`
  - `blankets-active.svg`
  - `pillows-active.svg`
  - `plaids-active.svg`
  - `towels-active.svg`
  - `boudoir-active.svg`
- Добавлена активная стрелка:
  - `arrow-right-primary.svg`
- Расширен `icon-map`:
  - `catalog*Active`
  - `chevronRightPrimary`
- В `CatalogMenu` добавлено переключение иконок/стрелки для активной категории.

### Проверка

- Линт изменённых TS/TSX файлов без ошибок.
- Визуальная проверка:
  - активный пункт левой колонки dropdown имеет primary-цвет для текста, иконки и стрелки;
  - неактивные пункты остаются в `Text-primary`.
