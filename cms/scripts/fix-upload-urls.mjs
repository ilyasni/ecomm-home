#!/usr/bin/env node

/**
 * Нормализация URL медиа в таблице files для production.
 *
 * Что делает:
 * - url: приводит к виду https://<STRAPI_PUBLIC_URL>/strapi-uploads/<file>
 * - formats.*.url: аналогично
 *
 * Запуск:
 * STRAPI_PUBLIC_URL=https://cms.produmantech.ru \
 *   node scripts/fix-upload-urls.mjs
 *
 * Опции:
 * --dry-run  Показать изменения без записи в БД
 */

import process from "node:process";
import pg from "pg";

const { Client } = pg;

const DRY_RUN = process.argv.includes("--dry-run");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function trimTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function buildPgConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    return {
      connectionString: databaseUrl,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
    };
  }

  return {
    host: requireEnv("DATABASE_HOST"),
    port: Number(process.env.DATABASE_PORT ?? 5432),
    database: requireEnv("DATABASE_NAME"),
    user: requireEnv("DATABASE_USERNAME"),
    password: requireEnv("DATABASE_PASSWORD"),
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
  };
}

function normalizeMediaUrl(input, publicBaseUrl) {
  if (typeof input !== "string" || !input) return input;

  const publicPrefix = `${publicBaseUrl}/strapi-uploads/`;
  if (input.startsWith(publicPrefix)) return input;

  const absUploads = input.match(/^https?:\/\/[^/]+\/uploads\/(.+)$/i);
  if (absUploads) return `${publicPrefix}${absUploads[1]}`;

  const absBucket = input.match(/^https?:\/\/[^/]+\/strapi-uploads\/(.+)$/i);
  if (absBucket) return `${publicPrefix}${absBucket[1]}`;

  const relUploads = input.match(/^\/uploads\/(.+)$/i);
  if (relUploads) return `${publicPrefix}${relUploads[1]}`;

  const relBucket = input.match(/^\/strapi-uploads\/(.+)$/i);
  if (relBucket) return `${publicPrefix}${relBucket[1]}`;

  return input;
}

function normalizeFormats(formats, publicBaseUrl) {
  if (!formats || typeof formats !== "object") return formats;

  let changed = false;
  const next = Array.isArray(formats) ? [...formats] : { ...formats };

  for (const key of Object.keys(next)) {
    const value = next[key];

    if (key === "url" && typeof value === "string") {
      const normalized = normalizeMediaUrl(value, publicBaseUrl);
      if (normalized !== value) {
        next[key] = normalized;
        changed = true;
      }
      continue;
    }

    if (value && typeof value === "object") {
      const nested = normalizeFormats(value, publicBaseUrl);
      if (nested !== value) {
        next[key] = nested;
        changed = true;
      }
    }
  }

  return changed ? next : formats;
}

async function main() {
  const publicBaseUrl = trimTrailingSlash(requireEnv("STRAPI_PUBLIC_URL"));
  const client = new Client(buildPgConfig());

  await client.connect();
  console.log(`Connected to DB. dryRun=${DRY_RUN}`);
  console.log(`Target media base: ${publicBaseUrl}/strapi-uploads/`);

  const { rows } = await client.query("SELECT id, url, formats FROM files ORDER BY id ASC");
  console.log(`Rows loaded: ${rows.length}`);

  let touched = 0;
  let urlChanged = 0;
  let formatsChanged = 0;

  for (const row of rows) {
    const nextUrl = normalizeMediaUrl(row.url, publicBaseUrl);
    const nextFormats = normalizeFormats(row.formats, publicBaseUrl);

    const hasUrlChange = nextUrl !== row.url;
    const hasFormatsChange = JSON.stringify(nextFormats) !== JSON.stringify(row.formats);

    if (!hasUrlChange && !hasFormatsChange) {
      continue;
    }

    touched += 1;
    if (hasUrlChange) urlChanged += 1;
    if (hasFormatsChange) formatsChanged += 1;

    if (!DRY_RUN) {
      await client.query(
        "UPDATE files SET url = $1, formats = $2, updated_at = NOW() WHERE id = $3",
        [nextUrl, nextFormats, row.id],
      );
    }
  }

  console.log(`Touched rows: ${touched}`);
  console.log(`URL changed: ${urlChanged}`);
  console.log(`Formats changed: ${formatsChanged}`);
  console.log(DRY_RUN ? "Dry run complete." : "Migration complete.");

  await client.end();
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
