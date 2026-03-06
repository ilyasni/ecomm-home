# Strapi Media URL migration (prod)

**Дата:** 2026-03-06  
**Статус:** Внедрено

## Контекст и цель

В production в таблице `files` встречались внутренние URL (`http://localhost:9002/...`, `http://minio:9000/...`), из-за чего браузер не мог загружать превью в Strapi Admin.

Цель: привести URL медиа к публичному домену CMS и обеспечить доступ к объектам через reverse proxy.

## Решение

1. Добавлен миграционный скрипт `cms/scripts/fix-upload-urls.mjs`.
2. Скрипт обновляет:
   - `files.url`
   - `files.formats.*.url`
3. Целевой формат URL:
   - `https://cms.produmantech.ru/strapi-uploads/<file>`
4. В nginx добавлен прокси `location /strapi-uploads/` -> MinIO internal host.

## Что изменено

- `cms/scripts/fix-upload-urls.mjs` — миграция URL в БД (поддержан `--dry-run`).
- `nginx.coolify-fallback.conf` — правило проксирования `/strapi-uploads/`.
- `DEPLOY.md` — runbook раздел с миграцией и проверками.

## Проверка результата

1. Выполнить:
   - `STRAPI_PUBLIC_URL=https://cms.produmantech.ru docker compose exec cms node scripts/fix-upload-urls.mjs`
2. Проверить SQL:
   - `SELECT url FROM files LIMIT 5;`
3. Проверить URL:
   - `https://cms.produmantech.ru/strapi-uploads/<file>` -> `200`
4. В Strapi Admin в Media Library превью загружаются.

## Риски и rollback

Риски:
- неверный `STRAPI_PUBLIC_URL` может записать некорректный префикс в `files`.
- неверный MinIO internal host в nginx даст 404/502 на `/strapi-uploads/`.

Rollback:
1. восстановить БД из бэкапа или откатить изменённые строки в `files`;
2. откатить nginx-конфиг и перезагрузить proxy.
