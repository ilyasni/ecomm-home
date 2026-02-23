"use client";

import React, { InputHTMLAttributes, forwardRef, useState } from "react";
import { Icon } from "@/design-system/icons";

export interface CountryOption {
  code: string;
  flag: string;
  label: string;
  dialCode: string;
}

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  countries?: CountryOption[];
  selectedCountry?: CountryOption;
  onCountryChange?: (country: CountryOption) => void;
  fullWidth?: boolean;
}

const defaultCountries: CountryOption[] = [
  { code: "RU", flag: "🇷🇺", label: "Россия", dialCode: "+7" },
  { code: "FR", flag: "🇫🇷", label: "Франция", dialCode: "+33" },
  { code: "DE", flag: "🇩🇪", label: "Германия", dialCode: "+49" },
  { code: "CZ", flag: "🇨🇿", label: "Чехия", dialCode: "+420" },
  { code: "DK", flag: "🇩🇰", label: "Дания", dialCode: "+45" },
  { code: "FI", flag: "🇫🇮", label: "Финляндия", dialCode: "+358" },
];

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      helperText,
      errorText,
      countries = defaultCountries,
      selectedCountry: controlledCountry,
      onCountryChange,
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalCountry, setInternalCountry] = useState<CountryOption>(
      controlledCountry || countries[0]
    );

    const currentCountry = controlledCountry || internalCountry;
    const isError = !!errorText;

    const handleCountrySelect = (country: CountryOption) => {
      if (!controlledCountry) {
        setInternalCountry(country);
      }
      onCountryChange?.(country);
      setIsOpen(false);
    };

    const baseClasses =
      "border rounded-[5px] px-3 py-3 text-base leading-[1.3] flex items-center gap-2 transition-colors";
    const stateClasses = isError
      ? "border-[var(--color-error)]"
      : "border-[var(--color-gray-light)]";
    const textClasses = disabled
      ? "text-[var(--color-gray)]"
      : "text-[var(--color-dark-gray)]";
    const widthClasses = fullWidth ? "w-full" : "";

    return (
      <div className={`flex flex-col gap-1 relative ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label className="text-base leading-[1.3] text-[var(--color-black)]">{label}</label>
        )}
        <div className={`${baseClasses} ${stateClasses} ${widthClasses} ${className}`}>
          <div className="relative">
            <button
              type="button"
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              className="flex items-center gap-1 shrink-0"
            >
              <span className="text-lg leading-none" role="img" aria-label={currentCountry.label}>
                {currentCountry.flag}
              </span>
              <Icon name="chevronDown" size={16} />
            </button>
            {isOpen && !disabled && (
              <div className="absolute top-full left-0 mt-1 bg-[var(--color-light)] border border-[var(--color-gray-light)] rounded-[5px] shadow-lg z-50 max-h-[233px] overflow-y-auto w-[343px] max-w-[calc(100vw-2rem)]">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[var(--color-selection)] transition-colors text-left border-b border-[var(--color-gray-light)] last:border-b-0"
                  >
                    <span className="text-xl leading-none" role="img" aria-label={country.label}>
                      {country.flag}
                    </span>
                    <span className="text-base leading-[1.3] text-[var(--color-black)]">
                      {country.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="h-10 w-px bg-[var(--color-gray-light)] shrink-0" />
          <input
            ref={ref}
            type="tel"
            disabled={disabled}
            placeholder={props.placeholder || "Номер телефона"}
            className={`flex-1 min-w-0 bg-transparent outline-none ${textClasses}`}
            {...props}
          />
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
        {isOpen && !disabled && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
