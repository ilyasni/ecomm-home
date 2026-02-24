import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { strapiGet, strapiFindBySlug, getStrapiMediaUrl } from "../strapi";

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("strapiGet", () => {
  it("формирует URL с параметрами и отправляет запрос", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    });

    await strapiGet("/products", { populate: "*" });

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("/api/products");
    expect(url).toContain("populate=");
  });

  it("добавляет Authorization header при наличии токена", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    });

    await strapiGet("/test");

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers).toHaveProperty("Content-Type", "application/json");
  });

  it("бросает ошибку при не-ok ответе", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(strapiGet("/missing")).rejects.toThrow("Strapi API error: 404 Not Found");
  });

  it("использует revalidate по умолчанию 60", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    });

    await strapiGet("/test");

    const [, options] = mockFetch.mock.calls[0];
    expect(options.next?.revalidate).toBe(60);
  });
});

describe("strapiFindBySlug", () => {
  it("формирует фильтр по slug", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [{ id: 1, documentId: "doc-1", slug: "test-slug" }],
          meta: {},
        }),
    });

    const result = await strapiFindBySlug("products", "test-slug");

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("filters");
    expect(url).toContain("slug");
    expect(url).toContain("test-slug");
    expect(result.data.documentId).toBe("doc-1");
  });

  it("бросает ошибку при пустом результате", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [], meta: {} }),
    });

    await expect(strapiFindBySlug("products", "non-existent")).rejects.toThrow(
      'Not found: products with slug "non-existent"'
    );
  });
});

describe("getStrapiMediaUrl", () => {
  it("возвращает пустую строку при null", () => {
    expect(getStrapiMediaUrl(null)).toBe("");
  });

  it("возвращает пустую строку при undefined", () => {
    expect(getStrapiMediaUrl(undefined)).toBe("");
  });

  it("возвращает абсолютный URL как есть", () => {
    expect(getStrapiMediaUrl("https://cdn.example.com/img.jpg")).toBe(
      "https://cdn.example.com/img.jpg"
    );
  });

  it("добавляет базовый URL к относительному пути", () => {
    const result = getStrapiMediaUrl("/uploads/test.jpg");
    expect(result).toContain("/uploads/test.jpg");
    expect(result).toMatch(/^https?:\/\//);
  });
});
