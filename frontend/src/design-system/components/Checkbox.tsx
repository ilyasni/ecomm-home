"use client";

import type { ChangeEvent } from "react";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
};

export function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label className={`flex items-center gap-2 ${className || ""}`}>
      <input
        type="checkbox"
        className="h-4 w-4 accent-[var(--color-brand)]"
        checked={checked}
        onChange={handleChange}
      />
      {label ? (
        <span className="text-sm text-[var(--color-foreground)]">{label}</span>
      ) : null}
    </label>
  );
}
