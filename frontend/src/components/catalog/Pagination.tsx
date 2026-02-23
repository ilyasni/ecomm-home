"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div className={`flex items-center justify-center gap-2 ${className || ""}`}>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors ${
            page === currentPage
              ? "bg-[var(--color-dark-gray)] text-white"
              : "text-[var(--color-dark-gray)] hover:bg-[var(--color-selection)]"
          }`}
        >
          {page}
        </button>
      ))}
      {totalPages > 5 && (
        <>
          <span className="text-[var(--color-gray)]">...</span>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-[var(--color-dark-gray)] hover:bg-[var(--color-selection)]"
          >
            {totalPages}
          </button>
        </>
      )}
    </div>
  );
}
