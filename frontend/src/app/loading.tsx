export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-selection)] border-t-[var(--color-brand)]" />
        <span className="text-sm text-[var(--color-dark)]">Загрузка...</span>
      </div>
    </div>
  );
}
