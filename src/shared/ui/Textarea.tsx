"use client";

import {
  forwardRef,
  useState,
  useEffect,
  type TextareaHTMLAttributes,
  type ReactNode,
  type ChangeEvent,
} from "react";

export const TEXTAREA_I18N = {
  en: {
    charCount: (current: number, max: number) => `${current}/${max} characters`,
  },
  ar: {
    charCount: (current: number, max: number) => `${current}/${max} حرف`,
  },
} as const;

export type TextareaLocale = keyof typeof TEXTAREA_I18N;

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  locale?: TextareaLocale;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      label,
      error = false,
      errorMessage,
      disabled,
      maxLength,
      locale = "en",
      autoResize = false,
      onChange,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? "");

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInternalValue(e.target.value);

      if (autoResize) {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }

      if (onChange) {
        onChange(e);
      }
    };

    const currentLength = String(internalValue).length;

    return (
      <div className="flex w-full flex-col gap-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              className={`text-base font-normal ${
                disabled ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-xs text-muted-foreground">
              {TEXTAREA_I18N[locale].charCount(currentLength, maxLength)}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={[
            "flex min-h-[150px] w-full rounded-[10px] border bg-transparent p-4 text-base font-normal transition-colors resize-y",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",
            error
              ? "border-danger focus-visible:border-danger focus-visible:ring-danger/40"
              : "border-border focus-visible:border-primary focus-visible:ring-primary/40 hover:border-primary/50",
            autoResize ? "overflow-hidden" : "",
            className,
          ].join(" ")}
          {...props}
        />
        {error && errorMessage && (
          <span className="text-sm text-danger">{errorMessage}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";