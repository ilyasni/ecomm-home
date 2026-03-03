# Phase 5 — Email & Notifications

**Дата реализации:** 2026-03-01
**Статус:** ✅ Реализована

---

## Что реализовано

### Стек
- **nodemailer ^8** — SMTP-транспорт (server-only, Node.js API)
- **@types/nodemailer ^7** — TypeScript-типы
- Graceful: если SMTP не настроен → письма пропускаются, ошибок нет

### Env-переменные (frontend)

| Переменная | Назначение | Пример |
|------------|-----------|--------|
| `SMTP_HOST` | SMTP-сервер | `smtp.yandex.ru` |
| `SMTP_PORT` | Порт (по умолчанию 587) | `465` |
| `SMTP_SECURE` | `true` = SSL/TLS, `false` = STARTTLS | `true` |
| `SMTP_USER` | Логин | `noreply@vitabrava.ru` |
| `SMTP_PASS` | Пароль | `...` |
| `SMTP_FROM` | От кого | `Vita Brava Home <noreply@vitabrava.ru>` |
| `EMAIL_ADMIN` | Адрес для уведомлений администратору | `info@vitabrava.ru` |

### Шаблоны писем

| Шаблон | Получатель | Триггер |
|--------|-----------|---------|
| `contactAdminHtml` | Администратор | `POST /api/contact` |
| `partnershipAdminHtml` | Администратор | `POST /api/partnership` |
| `orderRequestAdminHtml` | Администратор | `POST /api/order-request` |
| `orderConfirmationHtml` | Покупатель | `POST /api/email/order-confirmation` ← checkout |

### Архитектура

```
API route (contact/partnership/order-request)
  → сохраняет в Strapi (try/catch)
  → void sendEmail(...)  ← fire-and-forget, не блокирует ответ

checkout/page.tsx (handleSubmit)
  → Cart Complete → orderId
  → void fetch("/api/email/order-confirmation", {...})  ← fire-and-forget
  → бонусы, CDEK, payment redirect
```

### Шаблон HTML

Минимальный inline-CSS layout: тёмный header (#1a1a1a), белый body, бежевый footer.
Поля: label (12px gray uppercase) + value. Таблица товаров с итогами.
Все строки экранированы через `esc()` (XSS-safe).

---

## Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `frontend/package.json` | `+ nodemailer ^8, @types/nodemailer ^7` |
| `src/lib/email.ts` | **Создан.** Транспорт + 4 HTML-шаблона |
| `src/app/api/contact/route.ts` | `+ void sendEmail(contactAdminHtml)` |
| `src/app/api/partnership/route.ts` | `+ void sendEmail(partnershipAdminHtml)` |
| `src/app/api/order-request/route.ts` | `+ void sendEmail(orderRequestAdminHtml)` |
| `src/app/api/email/order-confirmation/route.ts` | **Создан.** POST endpoint для писем клиенту |
| `src/app/checkout/page.tsx` | `+ void fetch("/api/email/order-confirmation")` |
| `docker-compose.yml` | `+ SMTP_* и EMAIL_ADMIN env во frontend` |
| `.env.example` | `+ секция Email / SMTP` |

---

## TypeScript

- `tsc --noEmit` — чисто ✅
- `npx vitest run` — 23 файла, 166 тестов, все зелёные ✅
- Нет `any`, нет `@ts-ignore`

---

## Настройка в production

1. Задать `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` в `.env`
2. Задать `EMAIL_ADMIN` (куда приходят заявки с форм)
3. Задать `SMTP_FROM` (от кого — должен совпадать с аккаунтом SMTP)

Для **Яндекс 360**:
```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@vitabrava.ru
SMTP_PASS=...app-password...
```

Для **Gmail** (с App Password):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=vitabravahome@gmail.com
SMTP_PASS=...app-password...
```
