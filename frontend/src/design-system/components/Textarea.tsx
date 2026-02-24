"use client";

import React, { TextareaHTMLAttributes, forwardRef } from "react";

export type TextareaState = "default" | "fill" | "disabled";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  state?: TextareaState;
  maxLength?: number;
  showCharCount?: boolean;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      state = "default",
      maxLength,
      showCharCount = false,
      fullWidth = false,
      className = "",
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const isDisabled = state === "disabled" || disabled;
    const isFilled = state === "fill" || (value && value.toString().length > 0);
    const currentLength = value ? value.toString().length : 0;

    const baseClasses =
      "border rounded-[5px] px-3 py-3 text-base leading-[1.3] resize-none transition-colors";
    const stateClasses =
      isFilled && !isDisabled ? "border-[var(--color-brown)]" : "border-[var(--color-gray-light)]";
    const textClasses = isDisabled
      ? "text-[var(--color-gray)] bg-transparent"
      : isFilled
        ? "text-[var(--color-dark-gray)]"
        : "text-[var(--color-gray)]";
    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <div className={`relative flex flex-col gap-1 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label className="text-base leading-[1.3] text-[var(--color-black)]">{label}</label>
        )}
        <textarea
          ref={ref}
          disabled={isDisabled}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${stateClasses} ${textClasses} ${widthClasses} ${className}`}
          placeholder={props.placeholder || "Введите текст"}
          {...props}
        />
        {showCharCount && maxLength && (
          <div className="absolute right-3 bottom-3 text-xs leading-[1.1] text-[var(--color-gray)]">
            {currentLength}/{maxLength}
          </div>
        )}
        {helperText && !showCharCount && (
          <div className="text-xs leading-[1.1] text-[var(--color-gray)]">{helperText}</div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
