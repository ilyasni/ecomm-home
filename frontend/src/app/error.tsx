"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-center">
      <h1 className="text-4xl font-medium text-[var(--foreground)]">Что-то пошло не так</h1>
      <p className="mt-4 max-w-md text-base text-[var(--color-dark)]">
        Произошла ошибка при загрузке страницы. Попробуйте обновить или вернуться позже.
      </p>
      {process.env.NODE_ENV === "development" && error.message && (
        <pre className="mt-4 max-w-lg overflow-auto rounded bg-[var(--color-selection)] p-4 text-left text-xs text-[var(--color-dark)]">
          {error.message}
        </pre>
      )}
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 border border-[var(--color-brand)] px-8 py-3 text-sm font-medium tracking-wider text-[var(--foreground)] uppercase transition-colors hover:bg-[var(--color-brand)] hover:text-[var(--color-light)]"
      >
        Попробовать снова
      </button>
    </div>
  );
}
