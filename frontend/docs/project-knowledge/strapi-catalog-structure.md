# Структура каталога в Strapi — руководство для контент-менеджера

## Как работает меню каталога

CatalogMenu (выпадающее меню по клику «Каталог») автоматически загружает данные из Strapi.
Fallback: если Strapi недоступен, показываются встроенные данные из `src/data/catalog-menu.ts`.

**Путь данных:** Strapi Category → `getCategories()` → `HeaderServer` → `Header` → `CatalogMenu`

---

## URL-стратегия

| Тип ссылки | Формат URL | Пример |
|-----------|-----------|--------|
| Категория | `/catalog/[slug]` | `/catalog/bed-linen` |
| Подкатегория | `/catalog/[slug-dochernej]` | `/catalog/komplekty` |
| Фильтр по атрибуту | `/catalog/[slug]?[param]=[value]` | `/catalog/bed-linen?fabric=satin` |

> **Правило:** каждая подкатегория = отдельная запись Category с `parentCategory`.
> Вложенный роут `/catalog/[parent]/[child]` **не поддерживается** — даст 404.

---

## Заполнение Categories в Strapi

### Шаг 1: Создать родительские категории

В Strapi → Content Manager → **Category** → Add new entry.

| Поле | Тип | Обязательно | Пример |
|------|-----|-------------|--------|
| Title | String | ✅ | `Постельное белье` |
| Slug | UID | ✅ | `bed-linen` (вводить вручную, латиницей) |
| icon | String | ✅ | `catalogBedLinen` (см. список ниже) |
| sortOrder | Integer | — | `1` (порядок в меню слева) |
| image | Media | — | Обложка для страницы `/catalog` |
| isWide | Boolean | — | `true` для первой (широкой) карточки |
| parentCategory | Relation | — | Оставить пустым для корневой |

### Шаг 2: Добавить subcategories (компонент)

Секция **subcategories** — ссылки в правой части меню при ховере на категорию.

```
subcategories[0]:
  label: "Комплекты"
  href:  "/catalog/komplekty"   ← slug дочерней категории (создать в шаге 3)

subcategories[1]:
  label: "Наволочки"
  href:  "/catalog/navolochki"
```

### Шаг 3: Создать дочерние категории (подкатегории)

Те же поля что у родительской, плюс:

| Поле | Значение |
|------|---------|
| Title | `Комплекты` |
| Slug | `komplekty` |
| parentCategory | → связать с `Постельное белье` |
| sortOrder | `11` (больше родительской) |

### Шаг 4: Добавить filters (компонент)

Секция **filters** — быстрые атрибутные фильтры в меню.

```
filters[0]:
  title: "Ткань"
  options:
    [0]: label: "Сатин",   href: "/catalog/bed-linen?fabric=satin"
    [1]: label: "Хлопок",  href: "/catalog/bed-linen?fabric=cotton"
    [2]: label: "Лён",     href: "/catalog/bed-linen?fabric=linen"

filters[1]:
  title: "Плотность"
  options:
    [0]: label: "200 TC",  href: "/catalog/bed-linen?density=200"
    [1]: label: "300 TC",  href: "/catalog/bed-linen?density=300"

filters[2]:
  title: "Цвет"
  options:
    [0]: label: "Белый",   href: "/catalog/bed-linen?color=white"
    [1]: label: "Бежевый", href: "/catalog/bed-linen?color=beige"
```

---

## Доступные иконки для поля `icon`

Значения берутся из `frontend/src/design-system/icons/icon-map.ts`:

| Значение | Для категории |
|---------|--------------|
| `catalogBedLinen` | Постельное белье |
| `catalogHomeTextile` | Домашний текстиль |
| `catalogBlankets` | Одеяла |
| `catalogPillows` | Подушки |
| `catalogPlaids` | Пледы |
| `catalogTowels` | Полотенца |
| `catalogBoudoir` | Будуарные наряды |

---

## Заполнение Products в Strapi

### Обязательные поля

| Поле | Тип | Описание |
|------|-----|---------|
| title | String | Полное название товара |
| slug | UID | URL-идентификатор (автогенерируется из title) |
| price | Decimal | Цена в рублях (без знака ₽) |
| image | Media | Главное фото товара |
| category | Relation | Выбрать категорию из списка |
| productType | Enum | `product` / `set` / `giftCertificate` |
| inStock | Boolean | В наличии (по умолчанию `true`) |

### Дополнительные поля

| Поле | Описание |
|------|---------|
| oldPrice | Зачёркнутая цена (если есть скидка) |
| sku | Артикул (уникальный) |
| description | Краткое описание (для карточки) |
| gallery[] | Дополнительные фото |
| colors[] | Варианты цветов: `name` + `hex` |
| sizes[] | Варианты размеров: `label` + `value` |
| specifications[] | Таблица характеристик |
| composition | Состав ткани |
| careInstructions | Инструкция по уходу |

### productType — что выбрать

| Значение | Когда использовать |
|---------|-------------------|
| `product` | Обычный товар (наволочка, простыня, полотенце) |
| `set` | Комплект постельного белья (заполнить `setItems[]`) |
| `giftCertificate` | Подарочный сертификат |

### Комплект (set) — поле setItems[]

Фактическая схема компонента `product.set-item`:

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|---------|
| title | String | ✅ | Название позиции (напр. "Пододеяльник 200×220") |
| price | String | ✅ | Цена позиции (напр. "24000") |
| subtitle | String | — | Дополнительное описание |
| oldPrice | String | — | Цена до скидки |
| image | Media | — | Фото позиции |
| sizes | size-option[] | — | Варианты размеров |

```
setItems[0]:
  title: "Пододеяльник 200×220"
  price: "24000"

setItems[1]:
  title: "Простыня 240×270"
  price: "16000"

setItems[2]:
  title: "Наволочки 70×70 (2 шт)"
  price: "8000"
```

---

## Пример: заполнить категорию «Постельное белье»

1. **Создать родительскую категорию:**
   - Title: `Постельное белье`
   - Slug: `bed-linen`
   - icon: `catalogBedLinen`
   - sortOrder: `1`
   - isWide: `true`
   - image: загрузить обложку

2. **Добавить subcategories:**
   - `Комплекты` → `/catalog/komplekty`
   - `Наволочки` → `/catalog/navolochki`
   - `Простыни` → `/catalog/prostynі`
   - `Пододеяльники` → `/catalog/pododejalniki`

3. **Добавить filters:**
   - Ткань: Сатин, Хлопок, Лён
   - Плотность: 200 TC, 300 TC, 480 TC, 700 TC
   - Цвет: Белый, Бежевый, Серый

4. **Создать дочерние категории** (Комплекты, Наволочки и т.д.) с `parentCategory = Постельное белье`.

5. **Добавить товары** с `category = Постельное белье` (или дочерняя).

6. Нажать **Publish** на категории и всех товарах.

После публикации меню обновится автоматически (кэш 120 сек).

---

## Troubleshooting

**Категория не появляется в меню:**
- Проверить что категория опубликована (не Draft)
- Проверить поле `icon` — должно быть одно из значений выше
- Подождать 2 минуты (кэш `revalidate: 120`)

**Ссылка подкатегории даёт 404:**
- Убедиться что дочерняя категория создана в Strapi с правильным `slug`
- href должен быть `/catalog/[slug]`, а не `/catalog/[parent]/[slug]`

**Меню показывает старые данные:**
- Данные кэшируются на 2 минуты (`revalidate: 120`)
- В dev-режиме можно принудительно перезагрузить страницу
