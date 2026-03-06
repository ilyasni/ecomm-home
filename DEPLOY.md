# Деплой на Coolify

Платформа: [Coolify](https://coolify.io) (self-hosted PaaS).
Compose-файл для прода: `docker-compose.prod.yml` (только `cms` + `frontend`).
Инфраструктура (БД, Redis, MinIO, Meilisearch, Imgproxy) — управляется как отдельные ресурсы Coolify.

---

## Архитектура в production

```
Coolify
├── Services (managed)
│   ├── PostgreSQL 16      → порт 5432 (internal)
│   ├── Redis 7            → порт 6379 (internal)
│   ├── MinIO              → порт 9000 (internal) + 9001 console
│   ├── Meilisearch        → порт 7700 (internal)
│   └── Imgproxy           → публичный домен media.produmantech.ru
│
└── Applications (docker-compose.prod.yml)
    ├── cms    (Strapi 5)   → cms.produmantech.ru
    └── frontend (Next.js)  → produmantech.ru
```

---

## 1. Подготовка инфраструктурных сервисов

### PostgreSQL

В Coolify: **New Resource → Database → PostgreSQL 16**

Запомни/скопируй:
- Internal hostname (вида `postgres-xxxxxxxx`)
- Database name, user, password

### Redis

В Coolify: **New Resource → Database → Redis 7**

Запомни internal hostname.

### MinIO

В Coolify: **New Resource → Service → MinIO**

После запуска:
1. Открой MinIO Console (`http://<host>:9001`)
2. Создай bucket `strapi-uploads` (или своё имя)
3. Выставь bucket policy: **Public read** (для публичного доступа к медиафайлам)
4. Создай Access Key → сохрани `Access Key` и `Secret Key`

### Meilisearch

В Coolify: **New Resource → Service → Meilisearch**

Задай `MEILI_MASTER_KEY` (минимум 16 символов, `openssl rand -hex 32`).

### Imgproxy

В Coolify: **New Resource → Service → Imgproxy** (образ `darthsim/imgproxy:v3.24`)

Переменные окружения:
```
IMGPROXY_KEY=<openssl rand -hex 32>
IMGPROXY_SALT=<openssl rand -hex 32>
IMGPROXY_USE_S3=true
AWS_ACCESS_KEY_ID=<MinIO Access Key>
AWS_SECRET_ACCESS_KEY=<MinIO Secret Key>
AWS_S3_ENDPOINT_URL=http://<minio-internal-host>:9000
IMGPROXY_S3_REGION=us-east-1
IMGPROXY_MAX_SRC_RESOLUTION=50
```

Привяжи публичный домен: `media.produmantech.ru`

---

## 2. Деплой приложений

В Coolify: **New Resource → Docker Compose** → выбери репозиторий, укажи файл `docker-compose.prod.yml`.

---

## 3. Переменные окружения

### 3.1 CMS (Strapi)

#### Обязательные (`:?` — compose упадёт без них)

| Переменная Coolify | Значение |
|---|---|
| `DATABASE_HOST` | Internal hostname PostgreSQL |
| `DATABASE_PORT` | `5432` |
| `DATABASE_NAME` | Имя БД |
| `DATABASE_USERNAME` | Пользователь БД |
| `DATABASE_PASSWORD` | Пароль БД |
| `STRAPI_APP_KEYS` | 4 случайных строки через запятую: `openssl rand -base64 32` × 4 |
| `STRAPI_API_TOKEN_SALT` | `openssl rand -base64 32` |
| `STRAPI_ADMIN_JWT_SECRET` | `openssl rand -base64 32` |
| `STRAPI_TRANSFER_TOKEN_SALT` | `openssl rand -base64 32` |
| `STRAPI_JWT_SECRET` | `openssl rand -base64 32` |
| `STRAPI_ADMIN_ENCRYPTION_KEY` | `openssl rand -base64 32` |

> ⚠️ Все `STRAPI_*` секреты генерируются **один раз** и не меняются после первого запуска.
> Смена `APP_KEYS` / `JWT_SECRET` инвалидирует все активные сессии.

#### MinIO (загрузки медиафайлов)

| Переменная Coolify | Значение |
|---|---|
| `MINIO_ENDPOINT_URL` | `http://<minio-internal-host>:9000` |
| `MINIO_PUBLIC_URL` | `https://cms.produmantech.ru` |
| `MINIO_ACCESS_KEY` | Access Key из MinIO Console |
| `MINIO_SECRET_KEY` | Secret Key из MinIO Console |
| `MINIO_BUCKET` | `strapi-uploads` |
| `MINIO_REGION` | `us-east-1` |

> **`MINIO_PUBLIC_URL` обязателен**: без него Strapi записывает `http://localhost:9002/...` в `files.url`,
> что ломает source URL для imgproxy. Значение — публичный домен CMS без слеша и без пути bucket'а.
>
> Если MinIO не настроить — загрузки пойдут на локальный диск контейнера.
> При пересоздании контейнера медиафайлы **потеряются**.

#### Redis (опционально — кеш Strapi)

| Переменная | Значение |
|---|---|
| `REDIS_HOST` | Internal hostname Redis |
| `REDIS_PORT` | `6379` |
| `REDIS_PASSWORD` | Пароль Redis (если задан) |

#### Поиск (reindex webhook)

| Переменная | Значение |
|---|---|
| `REINDEX_SECRET` | Случайная строка (та же, что у Frontend) |

`FRONTEND_INTERNAL_URL` уже хардкодирован в compose как `http://frontend:3000`.

#### Сессия администратора (опционально)

| Переменная | Значение по умолчанию |
|---|---|
| `STRAPI_ADMIN_SESSION_MAX_LIFESPAN` | `86400` (1 день в сек) |
| `STRAPI_ADMIN_REFRESH_TOKEN_MAX_LIFESPAN` | `2592000` (30 дней в сек) |

---

### 3.2 Frontend (Next.js)

#### Обязательные

| Переменная Coolify | Значение |
|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | `https://cms.produmantech.ru` |
| `NEXT_PUBLIC_STRAPI_MEDIA_URL` | `https://cms.produmantech.ru` |
| `STRAPI_API_TOKEN` | API-токен из Strapi Admin (см. шаг 4) |
| `STRAPI_MEDIA_HOSTNAME` | `cms.produmantech.ru` |

#### Imgproxy

| Переменная | Значение |
|---|---|
| `IMGPROXY_URL` | `http://<imgproxy-internal-host>:8080` |
| `NEXT_PUBLIC_IMGPROXY_URL` | `https://media.produmantech.ru` |
| `IMGPROXY_KEY` | Тот же, что задан в Imgproxy-сервисе |
| `IMGPROXY_SALT` | Тот же, что задан в Imgproxy-сервисе |
| `IMGPROXY_HOSTNAME` | `media.produmantech.ru` |
| `IMGPROXY_SOURCE_REWRITE_FROM` | `https://cms.produmantech.ru` |
| `IMGPROXY_SOURCE_REWRITE_TO` | `http://<minio-internal-host>:9000` |
| `IMGPROXY_SOURCE_REWRITE_FROM_2` | `http://localhost:9002` |
| `IMGPROXY_SOURCE_REWRITE_TO_2` | `http://<minio-internal-host>:9000` |

#### Meilisearch

| Переменная | Значение |
|---|---|
| `MEILISEARCH_URL` | `http://<meilisearch-internal-host>:7700` |
| `MEILISEARCH_MASTER_KEY` | Тот же `MEILI_MASTER_KEY`, что задан в Meilisearch-сервисе |
| `REINDEX_SECRET` | Та же случайная строка, что у CMS |

#### Medusa Commerce (Phase 2 — пропусти если ещё не запущен)

| Переменная | Значение |
|---|---|
| `MEDUSA_BACKEND_URL` | `http://<medusa-internal-host>:9000` |
| `MEDUSA_PUBLISHABLE_KEY` | Publishable API Key из Medusa Admin |

#### Оплата YooKassa

| Переменная | Значение |
|---|---|
| `YOOKASSA_SHOP_ID` | ID магазина в личном кабинете YooKassa |
| `YOOKASSA_SECRET_KEY` | Секретный ключ |

> Если не заполнить — используется stub-режим (оплата не проводится).

#### Доставка CDEK

| Переменная | Значение |
|---|---|
| `CDEK_CLIENT_ID` | Client ID из личного кабинета CDEK |
| `CDEK_CLIENT_SECRET` | Client Secret |
| `CDEK_FROM_CITY_CODE` | Код города отправки (44 = Москва) |

#### Email / SMTP

| Переменная | Значение |
|---|---|
| `SMTP_HOST` | `smtp.yandex.ru` / `smtp.gmail.com` / ... |
| `SMTP_PORT` | `465` (SSL) или `587` (STARTTLS) |
| `SMTP_SECURE` | `true` для 465, `false` для 587 |
| `SMTP_USER` | Логин почты |
| `SMTP_PASS` | Пароль / App Password |
| `SMTP_FROM` | `Vita Brava Home <noreply@vitabrava.ru>` |
| `EMAIL_ADMIN` | Email для уведомлений об заказах/запросах |

> Если не настроить — письма молча не отправляются, сайт работает в штатном режиме.

#### CMS Auth (рекомендуется включить в prod)

| Переменная | Значение |
|---|---|
| `STRICT_CMS_AUTH` | `true` — при 401/403 от Strapi Next.js упадёт с ошибкой вместо тихого показа mock-данных |

---

## 4. Первый запуск: настройка Strapi

После того как CMS поднялся и прошёл healthcheck:

1. Открой `https://cms.produmantech.ru/admin`
2. Создай учётную запись администратора
3. **Settings → API Tokens → Create new token**
   - Name: `frontend-prod`
   - Token type: **Read-only** (или Full access если нужны мутации)
   - Скопируй токен — он показывается **только один раз**
4. Вставь токен в переменную `STRAPI_API_TOKEN` в Coolify (Frontend)
5. Перезапусти Frontend-сервис

---

## 5. Первый запуск: индексация поиска

После того как Frontend и Meilisearch запущены:

```bash
# Вызов ручного reindex
curl -X POST https://produmantech.ru/api/admin/search/reindex \
  -H "x-reindex-secret: <REINDEX_SECRET>"
```

---

## 6. Чеклист после деплоя

- [ ] `https://produmantech.ru` — главная страница открывается
- [ ] `https://cms.produmantech.ru/admin` — Strapi Admin доступен
- [ ] `https://media.produmantech.ru/health` — Imgproxy отвечает
- [ ] Изображения на главной загружаются через `media.produmantech.ru`
- [ ] Поиск возвращает результаты
- [ ] Форма контакта отправляет email (если SMTP настроен)
- [ ] Логи Frontend не содержат `[runtime-config]` ошибок

---

## 6.1 Восстановление превью в Strapi Media Library

Симптом: в `files.url`/`files.formats` сохранены внутренние URL (`http://localhost:9002/...`, `http://minio:9000/...`), и браузер не может загрузить превью.

### Шаг 1 — миграция URL в БД

Найди имя CMS-контейнера и запусти скрипт:

```bash
# Найти имя контейнера
sudo docker ps --format '{{.Names}}' | grep cms

# Dry-run (без записи)
sudo docker exec -e STRAPI_PUBLIC_URL=https://cms.produmantech.ru <cms-container-name> \
  node scripts/fix-upload-urls.mjs --dry-run

# Применить
sudo docker exec -e STRAPI_PUBLIC_URL=https://cms.produmantech.ru <cms-container-name> \
  node scripts/fix-upload-urls.mjs
```

> Если скрипт не найден (`Cannot find module`) — он ещё не задеплоен. Сделай прямой SQL:
>
> ```sql
> UPDATE files SET
>   url = replace(url, 'http://localhost:9002', 'https://cms.produmantech.ru'),
>   formats = replace(formats::text, 'http://localhost:9002', 'https://cms.produmantech.ru')::jsonb,
>   updated_at = NOW()
> WHERE url LIKE 'http://localhost:9002%';
> ```

### Шаг 2 — проксирование `/strapi-uploads/` в MinIO

**Coolify использует Traefik (не nginx).** Нужно положить файл в папку Traefik dynamic config:

```bash
sudo cp strapi-uploads-proxy.yaml /data/coolify/proxy/dynamic/strapi-uploads-proxy.yaml
```

Файл `strapi-uploads-proxy.yaml` есть в корне репозитория. Traefik подхватит его без перезагрузки (~2–3 сек).

Проверь после применения:

```bash
curl -o /dev/null -w "%{http_code}" https://cms.produmantech.ru/strapi-uploads/<любой-файл>
# Ожидаемо: 200
```

> Если сервер использует nginx (не Coolify/Traefik), добавь в конфиг `cms.produmantech.ru`:
> ```nginx
> location /strapi-uploads/ {
>     proxy_pass http://<minio-internal-host>:9000/strapi-uploads/;
>     proxy_http_version 1.1;
>     proxy_set_header Host $host;
> }
> ```

### Шаг 3 — проверки

```sql
SELECT url FROM files LIMIT 5;
```

Ожидаемо: URL начинаются с `https://cms.produmantech.ru/strapi-uploads/`.

Дополнительно:
- открыть `https://cms.produmantech.ru/admin`
- проверить Media Library и поля с изображениями в Content Manager
- убедиться, что превью загружаются без 404

---

## 7. Rollback

```bash
# В Coolify: откатить деплой через UI (Deployments → выбрать предыдущий → Redeploy)
# Или локально:
git checkout <previous-commit> docker-compose.prod.yml
# Запушить и перезапустить деплой в Coolify
```

---

## Генерация секретов (шпаргалка)

```bash
# Один секрет (base64)
openssl rand -base64 32

# Четыре ключа через запятую для STRAPI_APP_KEYS
echo "$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)"

# Hex-строка для IMGPROXY_KEY / IMGPROXY_SALT
openssl rand -hex 32
```
