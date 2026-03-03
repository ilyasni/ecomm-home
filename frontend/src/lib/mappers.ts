import type { StrapiMedia } from "@/types/strapi";
import { getStrapiMediaUrl } from "./strapi";
import { getImgproxyUrl, type ImgproxyOptions } from "./imgproxy";

export const PLACEHOLDER_IMAGE = "/assets/figma/placeholder.svg";

export function mapMedia(
  media: StrapiMedia | null | undefined,
  imgproxyOptions?: ImgproxyOptions
): string | undefined {
  if (!media?.url) return undefined;
  const rawUrl = getStrapiMediaUrl(media.url);
  return getImgproxyUrl(rawUrl, imgproxyOptions);
}

export function mapMediaOrPlaceholder(
  media: StrapiMedia | null | undefined,
  imgproxyOptions?: ImgproxyOptions
): string {
  return mapMedia(media, imgproxyOptions) ?? PLACEHOLDER_IMAGE;
}

export function mapMediaArray(
  media: StrapiMedia[] | null | undefined,
  imgproxyOptions?: ImgproxyOptions
): string[] {
  if (!media || !Array.isArray(media)) return [];
  return media.map((m) => getImgproxyUrl(getStrapiMediaUrl(m.url), imgproxyOptions));
}

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return "";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
