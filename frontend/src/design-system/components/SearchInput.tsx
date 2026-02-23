"use client";

import React, { InputHTMLAttributes, forwardRef, useState } from "react";
import { Icon } from "@/design-system/icons";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  onClear?: () => void;
  fullWidth?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, fullWidth = false, className = "", value, onChange, ...props }, ref) => {
    const [hasValue, setHasValue] = useState(!!value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else {
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(syntheticEvent);
      }
    };

    const baseClasses =
      "border border-[var(--color-gray-light)] rounded-[5px] px-3 py-3 text-base leading-[1.3] flex items-center gap-1";
    const textClasses = hasValue
      ? "text-[var(--color-black)]"
      : "text-[var(--color-gray)]";
    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <div className={`${baseClasses} ${widthClasses} ${className}`}>
        <Icon name="search" size={24} className="shrink-0" />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={handleChange}
          className={`flex-1 min-w-0 bg-transparent outline-none ${textClasses}`}
          placeholder={props.placeholder || "Поиск по сайту"}
          {...props}
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 flex items-center justify-center"
            aria-label="Очистить поиск"
          >
            <Icon name="close" size={24} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
