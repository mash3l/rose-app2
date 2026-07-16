"use client";

import {
  forwardRef,
  type SelectHTMLAttributes,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";

export const SELECT_I18N = {
  en: {
    placeholder: "Select an option",
  },
  ar: {
    placeholder: "اختر خياراً",
  },
} as const;

export type SelectLocale = keyof typeof SELECT_I18N;

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  locale?: SelectLocale;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = "",
      label,
      error = false,
      errorMessage,
      disabled,
      locale = "en",
      placeholder,
      children,
      ...props
    },
    ref
  ) => {
    const defaultPlaceholder = placeholder ?? SELECT_I18N[locale].placeholder;

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label
            className={`text-base font-normal ${
              disabled ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative flex w-full items-center">
          <select
            ref={ref}
            disabled={disabled}
            className={[
              "flex h-[49px] w-full appearance-none rounded-[10px] border bg-transparent px-4 py-2 text-base font-normal transition-colors cursor-pointer",
              "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-muted disabled:opacity-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",
              error
                ? "border-danger focus-visible:border-danger focus-visible:ring-danger/40"
                : "border-border focus-visible:border-primary focus-visible:ring-primary/40 hover:border-primary/50",
              className,
            ].join(" ")}
            {...props}
          >
            {defaultPlaceholder && (
              <option value="" disabled hidden>
                {defaultPlaceholder}
              </option>
            )}
            {children}
          </select>
          <div className="pointer-events-none absolute end-4 flex items-center justify-center text-muted-foreground">
            <ChevronDown size={20} />
          </div>
        </div>
        {error && errorMessage && (
          <span className="text-sm text-danger">{errorMessage}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";