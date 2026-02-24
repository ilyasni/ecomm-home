/**
 * Пытается получить данные из Strapi API.
 * При ошибке или отсутствии данных возвращает fallback (мок-данные).
 * В dev-режиме логирует ошибку для отладки.
 */
export async function withFallback<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const result = await fetcher();
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isExpectedNotFound = errorMessage.startsWith("Not found:");

    if (process.env.NODE_ENV === "development" && !isExpectedNotFound) {
      console.warn("[Strapi fallback]", error instanceof Error ? error.message : error);
    }
    return fallback;
  }
}
