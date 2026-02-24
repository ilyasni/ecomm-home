import { describe, it, expect } from "vitest";
import {
  mapMedia,
  mapMediaOrPlaceholder,
  mapMediaArray,
  formatPrice,
  formatDate,
  PLACEHOLDER_IMAGE,
} from "../mappers";
import type { StrapiMedia } from "@/types/strapi";

const mediaMock: StrapiMedia = {
  id: 1,
  documentId: "abc",
  url: "/uploads/test.jpg",
  alternativeText: null,
  name: "test.jpg",
  width: 800,
  height: 600,
  formats: null,
};

describe("mapMedia", () => {
  it("возвращает undefined при null", () => {
    expect(mapMedia(null)).toBeUndefined();
  });

  it("возвращает undefined при undefined", () => {
    expect(mapMedia(undefined)).toBeUndefined();
  });

  it("возвращает URL для StrapiMedia объекта", () => {
    const result = mapMedia(mediaMock);
    expect(result).toContain("/uploads/test.jpg");
  });

  it("не добавляет базовый URL к абсолютным путям", () => {
    const absolute: StrapiMedia = { ...mediaMock, url: "https://cdn.example.com/img.jpg" };
    expect(mapMedia(absolute)).toBe("https://cdn.example.com/img.jpg");
  });
});

describe("mapMediaOrPlaceholder", () => {
  it("возвращает placeholder при null", () => {
    expect(mapMediaOrPlaceholder(null)).toBe(PLACEHOLDER_IMAGE);
  });

  it("возвращает placeholder при undefined", () => {
    expect(mapMediaOrPlaceholder(undefined)).toBe(PLACEHOLDER_IMAGE);
  });

  it("возвращает URL для StrapiMedia объекта", () => {
    const result = mapMediaOrPlaceholder(mediaMock);
    expect(result).toContain("/uploads/test.jpg");
  });

  it("PLACEHOLDER_IMAGE указывает на SVG", () => {
    expect(PLACEHOLDER_IMAGE).toMatch(/\.svg$/);
  });
});

describe("mapMediaArray", () => {
  it("возвращает пустой массив при null", () => {
    expect(mapMediaArray(null)).toEqual([]);
  });

  it("возвращает пустой массив при undefined", () => {
    expect(mapMediaArray(undefined)).toEqual([]);
  });

  it("маппит массив StrapiMedia в URL-строки", () => {
    const result = mapMediaArray([mediaMock, { ...mediaMock, url: "/uploads/img2.png" }]);
    expect(result).toHaveLength(2);
    expect(result[0]).toContain("/uploads/test.jpg");
    expect(result[1]).toContain("/uploads/img2.png");
  });
});

describe("formatPrice", () => {
  it("возвращает пустую строку при null", () => {
    expect(formatPrice(null)).toBe("");
  });

  it("возвращает пустую строку при undefined", () => {
    expect(formatPrice(undefined)).toBe("");
  });

  it("форматирует число как рубли без копеек", () => {
    const result = formatPrice(12500);
    expect(result).toContain("12");
    expect(result).toContain("500");
  });

  it("форматирует ноль", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
  });
});

describe("formatDate", () => {
  it("возвращает пустую строку при null", () => {
    expect(formatDate(null)).toBe("");
  });

  it("возвращает пустую строку при undefined", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("возвращает пустую строку при пустой строке", () => {
    expect(formatDate("")).toBe("");
  });

  it("форматирует ISO-дату в DD.MM.YYYY", () => {
    const result = formatDate("2024-03-15T10:30:00.000Z");
    expect(result).toMatch(/15\.03\.2024/);
  });
});
