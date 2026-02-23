"use client";

import React, { SelectHTMLAttributes, forwardRef } from "react";
import { Icon } from "@/design-system/icons";

export type SelectState = "default" | "fill" | "disabled";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: SelectState;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      errorText,
      state = "default",
      fullWidth = false,
      className = "",
      disabled,
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    const isError = !!errorText;
    const isDisabled = state === "disabled" || disabled;
    const isFilled = state === "fill" || (props.value && props.value.toString().length > 0);

    const baseClasses =
      "border rounded-[5px] px-3 py-3 text-base leading-[1.3] appearance-none bg-transparent transition-colors pr-10";
    const stateClasses = isError
      ? "border-[var(--color-error)]"
      : isFilled && !isDisabled
        ? "border-[var(--color-brown)]"
        : "border-[var(--color-gray-light)]";
    const textClasses = isDisabled
      ? "text-[var(--color-gray)]"
      : isFilled
        ? "text-[var(--color-dark-gray)]"
        : "text-[var(--color-gray)]";
    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <div className={`flex flex-col gap-1 relative ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label className="text-base leading-[1.3] text-[var(--color-black)]">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            disabled={isDisabled}
            className={`${baseClasses} ${stateClasses} ${textClasses} ${widthClasses} ${className}`}
            {...props}
          >
            {!props.value && (
              <option value="" disabled>
                {placeholder || "Выберите опцию"}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name="chevronDown" size={24} />
          </div>
        </div>
        {(errorText || helperText) && (
          <div className="text-xs leading-[1.1] text-[var(--color-gray)]">
            {isError && errorText ? (
              <span className="text-[var(--color-error)]">{errorText}</span>
            ) : (
              helperText
            )}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
