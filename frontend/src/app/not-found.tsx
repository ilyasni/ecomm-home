import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-center">
      <h1 className="text-[120px] leading-none font-medium text-[var(--color-brand)]">404</h1>
      <p className="mt-4 text-2xl font-medium text-[var(--foreground)]">Страница не найдена</p>
      <p className="mt-2 max-w-md text-base text-[var(--color-dark)]">
        Возможно, страница была удалена или адрес введён неверно.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 border border-[var(--color-brand)] px-8 py-3 text-sm font-medium tracking-wider text-[var(--foreground)] uppercase transition-colors hover:bg-[var(--color-brand)] hover:text-[var(--color-light)]"
      >
        На главную
      </Link>
    </div>
  );
}
