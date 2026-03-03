"use client";

import { useEffect } from "react";

interface CatalogErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CatalogError({ error, reset }: CatalogErrorProps) {
  useEffect(() => {
    console.error("[catalog:error]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 text-center md:px-[39px]">
      <h2 className="text-2xl font-medium">Каталог временно недоступен</h2>
      <p className="mt-4 text-[var(--color-dark)]">
        Не удалось загрузить товары из CMS. Проверь доступы API Token и права на коллекции.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-[5px] bg-[var(--color-dark)] px-5 py-3 text-sm text-[var(--color-light)]"
      >
        Повторить
      </button>
    </div>
  );
}
