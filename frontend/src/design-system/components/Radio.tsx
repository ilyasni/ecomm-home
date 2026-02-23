"use client";

type RadioProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  className?: string;
};

export function Radio({
  name,
  value,
  checked,
  onChange,
  label,
  className,
}: RadioProps) {
  return (
    <label className={`flex items-center gap-2 ${className || ""}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="h-4 w-4 accent-[var(--color-brand)]"
      />
      <span className="text-sm text-[var(--color-foreground)]">{label}</span>
    </label>
  );
}
