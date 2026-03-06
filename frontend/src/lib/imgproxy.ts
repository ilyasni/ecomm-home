/**
 * Imgproxy client — Phase 4.5
 *
 * Env vars (server-only):
 *   IMGPROXY_URL            — internal Docker URL (http://imgproxy:8080), used for isImgproxyConfigured()
 *   IMGPROXY_KEY            — hex-encoded signing key
 *   IMGPROXY_SALT           — hex-encoded signing salt
 *   NEXT_PUBLIC_IMGPROXY_URL — public URL for browser access (http://localhost:8080 in dev,
 *                              https://media.produmantech.ru in prod).
 *                              Falls back to IMGPROXY_URL if not set.
 *
 * Подпись покрывает только path (не hostname), поэтому внутренний и публичный URL
 * могут различаться — подпись остаётся валидной.
 *
 * Graceful: если env не заданы → isImgproxyConfigured() = false →
 *           getImgproxyUrl() возвращает исходный URL без изменений.
 *
 * Подпись URL: HMAC-SHA256(hex_key, hex_salt + path), base64url
 * https://docs.imgproxy.net/signing_the_url
 */

import { createHmac } from "node:crypto";

const IMGPROXY_URL = process.env.IMGPROXY_URL ?? "";
const IMGPROXY_KEY = process.env.IMGPROXY_KEY ?? "";
const IMGPROXY_SALT = process.env.IMGPROXY_SALT ?? "";

/** Публичный URL imgproxy для браузера; fallback на внутренний IMGPROXY_URL */
const IMGPROXY_PUBLIC_URL = process.env.NEXT_PUBLIC_IMGPROXY_URL || IMGPROXY_URL;

/**
 * Rewrite: заменяет публичные base URL медиа на внутренние Docker URL,
 * чтобы imgproxy мог достучаться до источников из Docker-сети.
 *
 * Пара 1 (Strapi local uploads):
 *   IMGPROXY_SOURCE_REWRITE_FROM=http://localhost:1337
 *   IMGPROXY_SOURCE_REWRITE_TO=http://cms:1337
 *
 * Пара 2 (MinIO):
 *   IMGPROXY_SOURCE_REWRITE_FROM_2=http://localhost:9002
 *   IMGPROXY_SOURCE_REWRITE_TO_2=http://minio:9000
 */
const REWRITES: [string, string][] = [
  [process.env.IMGPROXY_SOURCE_REWRITE_FROM ?? "", process.env.IMGPROXY_SOURCE_REWRITE_TO ?? ""],
  [
    process.env.IMGPROXY_SOURCE_REWRITE_FROM_2 ?? "",
    process.env.IMGPROXY_SOURCE_REWRITE_TO_2 ?? "",
  ],
].filter(([from]) => Boolean(from)) as [string, string][];

function resolveSourceUrl(url: string): string {
  for (const [from, to] of REWRITES) {
    if (url.startsWith(from)) return to + url.slice(from.length);
  }
  return url;
}

/** true если все три env заданы и непусты */
export function isImgproxyConfigured(): boolean {
  return Boolean(IMGPROXY_URL && IMGPROXY_KEY && IMGPROXY_SALT);
}

export interface ImgproxyOptions {
  width?: number;
  height?: number;
  /** auto | fill | fit | crop | pad | ... (imgproxy resize types) */
  resize?: string;
  quality?: number;
  /** webp | png | jpg | avif */
  format?: string;
}

/**
 * Генерирует подписанный imgproxy URL.
 * Если imgproxy не настроен — возвращает исходный sourceUrl без изменений.
 *
 * @param sourceUrl — абсолютный URL исходного изображения (MinIO или Strapi)
 * @param options   — опции обработки (width, height, resize, quality, format)
 */
export function getImgproxyUrl(sourceUrl: string, options: ImgproxyOptions = {}): string {
  if (!sourceUrl) return sourceUrl;
  if (!isImgproxyConfigured()) return sourceUrl;

  const { width = 0, height = 0, resize = "auto", quality, format = "webp" } = options;

  // Ремапим публичный URL на внутренний Docker URL для imgproxy
  const internalSourceUrl = resolveSourceUrl(sourceUrl);

  // Кодируем исходный URL в base64url (imgproxy требует именно это)
  const encodedSource = Buffer.from(internalSourceUrl).toString("base64url");

  // Строим processing path: /resize:auto:width:height/quality:N/format/base64url
  const processingParts: string[] = [`resize:${resize}:${width}:${height}`];
  if (quality) processingParts.push(`quality:${quality}`);
  processingParts.push(`format:${format}`);

  const processingPath = processingParts.join("/");
  const path = `/${processingPath}/${encodedSource}`;

  // Подпись: HMAC-SHA256(key, salt + path)
  const keyBytes = Buffer.from(IMGPROXY_KEY, "hex");
  const saltBytes = Buffer.from(IMGPROXY_SALT, "hex");

  const signature = createHmac("sha256", keyBytes)
    .update(saltBytes)
    .update(path)
    .digest("base64url");

  return `${IMGPROXY_PUBLIC_URL}/${signature}${path}`;
}
