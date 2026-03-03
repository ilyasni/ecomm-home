# Frontend Audit — Responsive, Design System, Code Quality

**Дата:** 2026-03-01
**Ветка:** feat/production-deploy
**Статус:** Выполнено (Этапы 1–3)

---

## Что было сделано

### Этап 1 — Критические UX-баги

**A1. Checkout — перекрытие формы кнопкой на мобильном**
- `frontend/src/app/checkout/page.tsx:322` — `pb-28` → `pb-[200px] md:pb-20`
- `frontend/src/components/checkout/CheckoutSidebar.tsx:37` — `md:top-[160px]` → `md:top-[180px] desktop:top-[160px]`

---

### Этап 2 — Адаптивная вёрстка (B1–B6)

**B1. Grid без baseline grid-cols-1**
- `frontend/src/components/home/About.tsx` — добавлен `grid-cols-1`
- `frontend/src/components/home/Collections.tsx` — budget grid: `grid-cols-1 md:grid-cols-2 desktop:grid-cols-3`

**B2. Carousel 640px breakpoint**
- `frontend/src/components/home/Collections.tsx` — добавлен `640: { slidesPerView: 1.5, spaceBetween: 12 }`
- `frontend/src/components/home/Feedback.tsx` — то же
- `frontend/src/components/home/News.tsx` — то же

**B3. Header logo — адаптивный размер**
- `frontend/src/components/home/Header.tsx` — `size={170}` → `size={145}` на мобильном

**B4. FiltersPanel — tablet width**
- `frontend/src/components/catalog/FiltersPanel.tsx:172` — добавлен `md:w-[600px]`

**B5. CheckoutSidebar sticky**
- `frontend/src/components/checkout/CheckoutSidebar.tsx:37` — исправлен sticky offset для планшета

**B6. Boutique images md height**
- `frontend/src/components/home/Boutique.tsx:57` — добавлен `md:h-[400px]`

---

### Этап 3 — CSS токены и оверлеи

**C1. Overlay CSS-переменные**

Добавлены в `frontend/src/app/globals.css`:
```css
--overlay-dark-light: rgba(17, 10, 0, 0.25);
--overlay-dark-warm: rgba(17, 10, 0, 0.35);
--overlay-dark: rgba(0, 0, 0, 0.3);
--overlay-dark-medium: rgba(33, 33, 31, 0.3);
```

Заменены hardcoded rgba в 8 файлах:
| Файл | Было | Стало |
|------|------|-------|
| `components/home/Hero.tsx` | `rgba(17,10,0,0.25)` | `var(--overlay-dark-light)` |
| `components/collections/CollectionHero.tsx` | `rgba(17,10,0,0.25)` | `var(--overlay-dark-light)` |
| `components/about/AboutHero.tsx` | `rgba(17,10,0,0.25)` | `var(--overlay-dark-light)` |
| `components/cooperation/CooperationHero.tsx` | `rgba(17,10,0,0.35)` | `var(--overlay-dark-warm)` |
| `components/catalog/CategoryCard.tsx` | `rgba(0,0,0,0.3)` | `var(--overlay-dark)` |
| `components/about/AboutCollections.tsx` | `rgba(0,0,0,0.3)` | `var(--overlay-dark)` |
| `components/home/Collections.tsx` | `rgba(0,0,0,0.3)` | `var(--overlay-dark)` |
| `components/home/Boutique.tsx` | `rgba(33,33,31,0.3)` | `var(--overlay-dark-medium)` |

**C2. Дублирующиеся токены — решение**
- `--color-dark-gray` и `--color-button` сохранены (30+ использований, риск деградации)
- Задача перенесена в технический долг

**D1. Next.js Image оптимизация**
- `remotePatterns` уже настроен в `next.config.ts` для Strapi, MinIO, Imgproxy
- `loading="lazy"` — дефолт в Next.js Image для non-priority изображений (явное добавление не нужно)
- Удаление `unoptimized` отложено: компоненты используют `/assets/figma/placeholder.svg` (SVG не оптимизируется Next.js), требует отдельной замены плейсхолдеров реальными изображениями

---

## Что не было исправлено (технический долг)

| Пункт | Причина |
|-------|---------|
| Удаление `--color-dark-gray` / `--color-button` дублей | 30+ использований в компонентах и тестах |
| Удаление `unoptimized` с Image компонентов | SVG placeholders не совместимы с оптимизатором |
| Тесты для 12 компонентов design-system | Не критично, добавить в следующей итерации |
| Перенос Pagination/Breadcrumbs/Tabs в design-system | Требует отдельного рефакторинга |
| NewsCard рефакторинг (Large/Medium/Small → variant) | Требует отдельного рефакторинга |

---

## Верификация

```
npx tsc --noEmit  → 0 ошибок
npx vitest run    → 24 test files, 184 tests, все зелёные
```

Ручная проверка (DevTools):
- 320px: checkout форма не перекрывается кнопкой ✓
- 640px: карусели без скачка ✓
- 768px: FiltersPanel шириной 600px ✓
- 1400px: desktop layout без изменений ✓
