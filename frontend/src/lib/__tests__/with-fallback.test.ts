import { describe, it, expect, vi, beforeEach } from "vitest";
import { withFallback } from "../with-fallback";

describe("withFallback", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("возвращает данные при успешном fetcher", async () => {
    const data = { items: [1, 2, 3] };
    const result = await withFallback(() => Promise.resolve(data), { items: [] });
    expect(result).toEqual(data);
  });

  it("возвращает fallback при ошибке fetcher", async () => {
    const fallback = { items: [] as number[] };
    const result = await withFallback(() => Promise.reject(new Error("Network error")), fallback);
    expect(result).toEqual(fallback);
  });

  it("логирует предупреждение в development mode", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await withFallback(() => Promise.reject(new Error("API down")), null);

    expect(warnSpy).toHaveBeenCalledWith("[Strapi fallback]", "API down");
  });

  it("не логирует в production mode", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await withFallback(() => Promise.reject(new Error("API down")), null);

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("возвращает fallback при non-Error throw", async () => {
    const result = await withFallback(() => Promise.reject("string error"), "default");
    expect(result).toBe("default");
  });
});
