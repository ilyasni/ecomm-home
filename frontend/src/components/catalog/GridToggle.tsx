"use client";

type GridToggleProps = {
  value: 3 | 4;
  onChange: (value: 3 | 4) => void;
  className?: string;
};

export function GridToggle({ value, onChange, className }: GridToggleProps) {
  return (
    <div className={`flex items-center gap-1 ${className || ""}`}>
      <button
        type="button"
        onClick={() => onChange(3)}
        className={`flex items-center justify-center w-6 h-6 transition-opacity ${
          value === 3 ? "opacity-100" : "opacity-40 hover:opacity-70"
        }`}
        aria-label="3 колонки"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <rect width="5" height="14" fill="currentColor" />
          <rect x="6.5" width="5" height="14" fill="currentColor" />
          <rect x="13" width="5" height="14" fill="currentColor" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange(4)}
        className={`flex items-center justify-center w-6 h-6 transition-opacity ${
          value === 4 ? "opacity-100" : "opacity-40 hover:opacity-70"
        }`}
        aria-label="4 колонки"
      >
        <svg width="19" height="14" viewBox="0 0 19 14" fill="none">
          <rect width="4" height="14" fill="currentColor" />
          <rect x="5" width="4" height="14" fill="currentColor" />
          <rect x="10" width="4" height="14" fill="currentColor" />
          <rect x="15" width="4" height="14" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
