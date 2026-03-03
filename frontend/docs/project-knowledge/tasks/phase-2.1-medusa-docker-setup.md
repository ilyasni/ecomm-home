# Phase 2.1: Medusa v2 — Docker Setup

**Статус:** Завершено
**Дата:** 2026-02-27

## Что сделано

Развёрнут Medusa v2 Commerce в docker-compose с отдельной PostgreSQL БД.

## Ключевые файлы

| Файл | Описание |
|------|----------|
| `medusa/Dockerfile` | node:20-alpine, npm install --legacy-peer-deps |
| `medusa/package.json` | `@medusajs/medusa`, `@medusajs/cli`, `@medusajs/admin-sdk` |
| `medusa/medusa-config.js` | CommonJS конфиг (без ts-node) |
| `medusa/start.sh` | `medusa db:migrate` → `medusa develop` (LF endings) |
| `medusa/.dockerignore` | исключает `medusa-config.ts` |
| `docker-compose.yml` | сервисы `medusa` + `medusa_postgres` |
| `~/.docker/daemon.json` | добавлен `"dns": ["8.8.8.8","8.8.4.4"]` |
| `frontend/src/lib/medusa.ts` | HTTP-клиент Medusa Store API |
| `frontend/src/lib/commerce/mappers.ts` | маппинг Medusa → CommerceProductRef |

## Переменные окружения (.env)

```
MEDUSA_POSTGRES_DB=medusa
MEDUSA_POSTGRES_USER=medusa
MEDUSA_POSTGRES_PASSWORD=medusa_dev_password
MEDUSA_JWT_SECRET=dev-medusa-jwt-secret-value
MEDUSA_COOKIE_SECRET=dev-medusa-cookie-secret-value
MEDUSA_STORE_CORS=http://localhost:3000
MEDUSA_ADMIN_CORS=http://localhost:9000
MEDUSA_AUTH_CORS=http://localhost:3000,http://localhost:9000
MEDUSA_PUBLISHABLE_KEY=pk_fed261...  # создан через Admin UI
```

## Medusa Admin

- URL: http://localhost:9000/app
- Email: admin@vitabrava.ru
- Password: VitaBrava2026!

## Настроенные данные

| Сущность | Значение | ID |
|----------|----------|-----|
| Region | Russia (RUB) | reg_01KJG7NT22W2WTVAVZ9ZREEYMZ |
| Sales Channel | Vita Brava Home | sc_01KJG7S26GVTEGVPFNCR7FSH74 |
| Publishable Key | pk_fed261... | - |

## Проблемы и решения

### 1. `medusa: not found`
**Причина:** `@medusajs/cli` — отдельный пакет (не входит в `@medusajs/medusa`).
**Решение:** Добавить `"@medusajs/cli": "^2.0.0"` в dependencies.

### 2. `set: illegal option -` в start.sh
**Причина:** CRLF line endings (Windows).
**Решение:** Писать файл через Node.js `fs.writeFileSync` с LF.

### 3. `Cannot find module 'ts-node'`
**Причина:** `medusa develop` ожидает `ts-node` для компиляции `medusa-config.ts`.
**Решение:** Создать `medusa-config.js` (CommonJS) вместо TypeScript.

### 4. DNS `EAI_AGAIN registry.yarnpkg.com` при Docker build
**Причина:** Docker daemon на Windows после рестарта не имел DNS.
**Решение:** Добавить `"dns": ["8.8.8.8","8.8.4.4"]` в `~/.docker/daemon.json`, перезапустить Docker Desktop.

### 5. Белая страница Admin UI
**Причина:** `@medusajs/admin-sdk` не установлен — требуется для `@medusajs/draft-order`.
**Решение:** `npm install @medusajs/admin-sdk --legacy-peer-deps` в работающем контейнере (package в volume сохраняется). Очистить Vite кэш: `rm -rf /server/node_modules/.vite`.

### 6. RUB не отображается в UI
**Причина:** Поиск в UI не находит, но валюта есть в БД.
**Решение:** Создать регион через Admin UI с EUR, затем обновить через API:
```bash
curl -X POST http://localhost:9000/admin/regions/{id} \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"currency_code":"rub"}'
```

## Используемые порты

| Сервис | Порт |
|--------|------|
| Medusa API + Admin | 9000 |
| Medusa PostgreSQL | 5433 (host) → 5432 (container) |

## Healthcheck

```yaml
test: ["CMD", "node", "-e", "require('http').get('http://localhost:9000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]
start_period: 180s  # миграции занимают ~30 сек
```

## Следующие шаги (Phase 2.2+)

- Phase 2.2: Sync worker Medusa → Strapi (поле `medusa_product_id`)
- Phase 2.3: Cart → Medusa Cart API (убрать захардкоженные 64 000₽)
- Phase 2.4: Промокоды → Medusa Discounts API
- Phase 2.5: Checkout → Medusa Order
