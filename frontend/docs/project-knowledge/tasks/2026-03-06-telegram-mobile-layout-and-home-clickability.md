# Telegram mobile layout and home clickability

## Context

- На iOS в Telegram WebView на мобильной главной странице визуально "плыла" верстка.
- На главной интерактивные блоки категорий и CTA в секции сертификатов не вели пользователя дальше по воронке.
- Требовался минимальный и безопасный фикс без изменения API и данных.

## Problem / Goal

- Устранить симптомы нестабильной мобильной верстки в Telegram WebView.
- Вернуть кликабельность ключевых блоков на главной: карточки категорий и кнопку сертификата.

## Solution

- Карточки категорий на главной переведены с декоративных контейнеров на ссылки.
- В данные категорий добавлены явные `href`, а для совместимости оставлен fallback-маппинг по `id`.
- Кнопка в секции сертификата получила навигацию на страницу подарочных сертификатов.
- Добавлены безопасные CSS-настройки для мобильных WebView: фиксация text-size-adjust и защита от горизонтального сдвига.
- Измененные файлы:
  - `frontend/src/components/home/Categories.tsx`
  - `frontend/src/components/home/Certificate.tsx`
  - `frontend/src/app/page.tsx`
  - `frontend/src/data/home.ts`
  - `frontend/src/app/globals.css`

## Implementation Notes

- Для источника категорий из Strapi в `home`-маппинге добавлено поле `href` по `slug`.
- Для fallback-данных (`src/data/home.ts`) добавлены прямые ссылки на соответствующие разделы каталога.
- Для проверки корректности подхода сверены рекомендации по viewport и mobile-behavior через Context7 (`/vercel/next.js`, `env(safe-area-inset-*)`).

## Checks

- Локально проверены IDE-диагностики (`ReadLints`) по измененным файлам — ошибок нет.
- Изменения ограничены UI-слоем и маршрутизацией, без влияния на backend-контракты.

## Impact / Rollback

- Затронут только frontend-UI главной страницы и глобальные клиентские CSS-настройки.
- Риск: в редких WebView может отличаться поведение text-size-adjust.
- Rollback: откатить перечисленные файлы до предыдущей версии.

## Links

- Context7: `/vercel/next.js` (viewport), `/websites/css-tricks_almanac` (`env()` и safe-area).
