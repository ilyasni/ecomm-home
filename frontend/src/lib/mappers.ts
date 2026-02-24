import type { StrapiMedia } from "@/types/strapi";
import { getStrapiMediaUrl } from "./strapi";

export const PLACEHOLDER_IMAGE = "/assets/figma/placeholder.svg";

export function mapMedia(media: StrapiMedia | null | undefined): string | undefined {
  if (!media?.url) return undefined;
  return getStrapiMediaUrl(media.url);
}

export function mapMediaOrPlaceholder(media: StrapiMedia | null | undefined): string {
  return mapMedia(media) ?? PLACEHOLDER_IMAGE;
}

export function mapMediaArray(media: StrapiMedia[] | null | undefined): string[] {
  if (!media || !Array.isArray(media)) return [];
  return media.map((m) => getStrapiMediaUrl(m.url));
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
