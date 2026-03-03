# Phase 4.5 — MinIO + Imgproxy: объектное хранилище и оптимизация изображений

**Дата реализации:** 2026-02-28
**Статус:** ✅ Реализована (4.5.1–4.5.6)

---

## Контекст

**До Phase 4.5:** Strapi хранит загруженные медиафайлы в локальной папке `/opt/app/public/uploads` (Docker volume `strapi_uploads`). Нет изменения размера, нет WebP-конвертации, нет CDN-кэша.

**Цель Phase 4.5:**
- **MinIO** — S3-совместимое объектное хранилище. Strapi загружает файлы туда через `@strapi/provider-upload-aws-s3` (с `forcePathStyle: true`).
- **Imgproxy** — сервис динамической обработки изображений (resize, WebP/AVIF, подписанные URL).
- **Graceful:** если `IMGPROXY_URL`/ключи не заданы → `getImgproxyUrl()` возвращает оригинальный URL без изменений.

---

## Что реализовано

### 4.5.1 — `docker-compose.yml`

Добавлены два новых сервиса:

```yaml
minio:
  image: minio/minio:RELEASE.2024-11-07T00-52-20Z
  command: server /data --console-address ":9001"
  ports:
    - "9002:9000"   # S3 API
    - "9001:9001"   # Web console
  volumes:
    - minio_data:/data

imgproxy:
  image: darthsim/imgproxy:v3.24
  depends_on:
    minio:
      condition: service_healthy
  environment:
    IMGPROXY_KEY, IMGPROXY_SALT, IMGPROXY_USE_S3=true
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_ENDPOINT_URL
  ports:
    - "8080:8080"
```

**CMS env** (добавлены):
- `MINIO_ENDPOINT_URL=http://minio:9000`
- `MINIO_ACCESS_KEY=${MINIO_ROOT_USER}`
- `MINIO_SECRET_KEY=${MINIO_ROOT_PASSWORD}`
- `MINIO_BUCKET=${MINIO_BUCKET:-strapi-uploads}`
- `MINIO_REGION=us-east-1`

**Frontend env** (добавлены):
- `IMGPROXY_URL=http://imgproxy:8080`
- `IMGPROXY_KEY=${IMGPROXY_KEY}`
- `IMGPROXY_SALT=${IMGPROXY_SALT}`

**CMS** теперь зависит от `minio: service_healthy`.

### 4.5.2 — Strapi: S3 upload provider

`cms/package.json` — добавлена зависимость:
```json
"@strapi/provider-upload-aws-s3": "^5.36.1"
```

`cms/config/plugins.ts` — условная конфигурация (только если `MINIO_ENDPOINT_URL` задан):
```typescript
...(minioEndpoint ? {
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          endpoint: env('MINIO_ENDPOINT_URL'),
          forcePathStyle: true,
          region: env('MINIO_REGION', 'us-east-1'),
          credentials: { accessKeyId, secretAccessKey },
        },
        params: { Bucket: env('MINIO_BUCKET', 'strapi-uploads') },
      },
    },
  },
} : {})
```

> `forcePathStyle: true` обязателен для MinIO (path-style URLs вместо virtual-hosted).

### 4.5.3 — `next.config.ts`: remotePatterns

Добавлены паттерны для:
- MinIO прямой доступ: `localhost:9002/**`, `minio:9000/**`
- Imgproxy: `localhost:8080/**`, `imgproxy:8080/**`
- Production imgproxy hostname: `process.env.IMGPROXY_HOSTNAME` (если задан)

### 4.5.4 — `src/lib/imgproxy.ts`

Минимальный клиент для генерации подписанных imgproxy URL (без npm-пакета).

**Подпись URL** (HMAC-SHA256):
```typescript
const signature = createHmac("sha256", keyBytes)
  .update(saltBytes)
  .update(path)
  .digest("base64url");
// URL: {IMGPROXY_URL}/{signature}/{processing}/{base64url(sourceUrl)}
```

**Экспорты:**
| Функция / тип | Назначение |
|---|---|
| `isImgproxyConfigured()` | `true` если IMGPROXY_URL + KEY + SALT заданы |
| `getImgproxyUrl(sourceUrl, options?)` | Подписанный imgproxy URL или оригинальный (graceful) |
| `ImgproxyOptions` | `width, height, resize, quality, format` |

**Processing path** формат: `resize:{type}:{w}:{h}/quality:{q}/format:{fmt}`

### 4.5.5 — `src/lib/mappers.ts`

`mapMedia()`, `mapMediaOrPlaceholder()`, `mapMediaArray()` — добавлен опциональный второй аргумент `imgproxyOptions?: ImgproxyOptions`.

```typescript
// До:
return getStrapiMediaUrl(media.url);

// После:
const rawUrl = getStrapiMediaUrl(media.url);
return getImgproxyUrl(rawUrl, imgproxyOptions);
```

**Graceful:** если imgproxy не настроен — `getImgproxyUrl` возвращает `rawUrl` без изменений. Существующий код не меняет поведения.

### 4.5.6 — `nginx.coolify-fallback.conf`

Добавлены два блока для `media.produmantech.ru`:

```nginx
server {
    listen 80;
    server_name media.produmantech.ru;
    location / { return 301 https://...; }
}

server {
    listen 443 ssl http2;
    server_name media.produmantech.ru;
    # ...
    location / {
        proxy_pass http://imgproxy-...:8080;
    }
}
```

---

## Env переменные (добавить в .env)

```env
# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your-strong-minio-password-here
MINIO_BUCKET=strapi-uploads

# Imgproxy
IMGPROXY_KEY=your-hex-encoded-imgproxy-key-32-bytes-min
IMGPROXY_SALT=your-hex-encoded-imgproxy-salt-32-bytes-min

# Production (опционально, для Next.js remotePatterns)
IMGPROXY_HOSTNAME=media.produmantech.ru
```

---

## Первый запуск (Setup)

```bash
# 1. Запустить MinIO
docker-compose up minio

# 2. Создать bucket (через MinIO console http://localhost:9001)
#    или через mc CLI:
docker-compose exec minio mc alias set local http://localhost:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD
docker-compose exec minio mc mb local/strapi-uploads
docker-compose exec minio mc anonymous set download local/strapi-uploads

# 3. Запустить CMS — новые загрузки пойдут в MinIO
docker-compose up cms

# 4. Запустить imgproxy
docker-compose up imgproxy
```

---

## URL flow

```
Strapi загружает файл → MinIO (http://minio:9000/strapi-uploads/image.jpg)
                              ↓
getStrapiMediaUrl()    → http://minio:9000/strapi-uploads/image.jpg
                              ↓
getImgproxyUrl(url, { width: 800, format: "webp" })
                              ↓
http://imgproxy:8080/{signature}/resize:auto:800:0/format:webp/{base64url(source)}
```

---

## Использование в компонентах

```typescript
import { mapMedia } from "@/lib/mappers";

// Обычный URL (imgproxy если настроен, иначе оригинал)
const imageUrl = mapMedia(product.image);

// С параметрами обработки
const thumbnailUrl = mapMedia(product.image, { width: 400, height: 400, format: "webp" });
const heroUrl = mapMedia(hero.image, { width: 1920, quality: 85, format: "webp" });
```

---

## TypeScript

- `tsc --noEmit` — чисто ✅
- `npx vitest run` — 23 файла, 166 тестов, все зелёные ✅
- Нет `any`, нет `@ts-ignore`

---

## Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `docker-compose.yml` | Добавлены сервисы `minio`, `imgproxy`, env в cms+frontend, volume `minio_data` |
| `cms/package.json` | Добавлен `@strapi/provider-upload-aws-s3: ^5.36.1` |
| `cms/config/plugins.ts` | Условный S3 upload provider (при наличии MINIO_ENDPOINT_URL) |
| `frontend/next.config.ts` | Добавлены remotePatterns для MinIO + imgproxy |
| `frontend/src/lib/imgproxy.ts` | **Создан.** Imgproxy клиент (HMAC-SHA256 подпись) |
| `frontend/src/lib/mappers.ts` | `mapMedia/mapMediaArray` → `getImgproxyUrl()` (graceful) |
| `nginx.coolify-fallback.conf` | Добавлен блок `media.produmantech.ru` → imgproxy |
