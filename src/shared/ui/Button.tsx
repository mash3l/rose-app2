"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

export const BUTTON_I18N = {
  en: {
    loading: "Loading...",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    confirm: "Confirm",
  },
  ar: {
    loading: "جاري التحميل...",
    submit: "إرسال",
    cancel: "إلغاء",
    save: "حفظ",
    delete: "حذف",
    confirm: "تأكيد",
  },
} as const;

export type ButtonLocale = keyof typeof BUTTON_I18N;

type CanonicalVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "outline-secondary"
  | "ghost"
  | "destructive";

export type ButtonVariant =
  CanonicalVariant | "light" | "outline-primary" | "danger";

function resolveVariant(variant: ButtonVariant): CanonicalVariant {
  switch (variant) {
    case "light":
      return "secondary";
    case "outline-primary":
      return "outline";
    case "danger":
      return "destructive";
    default:
      return variant;
  }
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
  locale?: ButtonLocale;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isIconOnly?: boolean;
}

// Fixed logic: Use 'not-[data-loading]:disabled' to ensure styles only apply when NOT loading
const disabledFilledStyles =
  "not-[data-loading]:disabled:bg-button-disabled not-[data-loading]:disabled:text-muted-foreground not-[data-loading]:disabled:opacity-100";

const variantStyles: Record<CanonicalVariant, string> = {
  primary: [
    "bg-primary text-white hover:bg-primary-hover",
    disabledFilledStyles,
  ].join(" "),
  secondary: [
    "bg-primary-light text-primary hover:bg-maroon-100 dark:hover:bg-soft-pink-400",
    disabledFilledStyles,
  ].join(" "),
  outline: [
    "border border-maroon-100 dark:border-soft-pink-800 text-primary bg-transparent hover:bg-primary-light",
    "not-[data-loading]:disabled:border-muted not-[data-loading]:disabled:text-muted-foreground not-[data-loading]:disabled:bg-transparent not-[data-loading]:disabled:opacity-100",
  ].join(" "),
  "outline-secondary": [
    "border border-border text-foreground bg-transparent hover:bg-muted/50",
    "not-[data-loading]:disabled:border-muted not-[data-loading]:disabled:text-muted-foreground not-[data-loading]:disabled:bg-transparent not-[data-loading]:disabled:opacity-100",
  ].join(" "),
  ghost: [
    "text-foreground bg-transparent hover:bg-muted",
    "not-[data-loading]:disabled:text-muted-foreground not-[data-loading]:disabled:bg-transparent not-[data-loading]:disabled:opacity-100",
  ].join(" "),
  destructive: [
    "bg-danger text-white hover:bg-red-600",
    disabledFilledStyles,
  ].join(" "),
};

export const Button = ({
  children,
  className = "",
  variant = "primary",
  isLoading = false,
  disabled,
  loadingText,
  locale = "en",
  leftIcon,
  rightIcon,
  isIconOnly = false,
  type = "button",
  ...props
}: ButtonProps) => {
  const resolved = resolveVariant(variant);
  const isDisabled = disabled || isLoading;
  const resolvedLoadingText = loadingText ?? BUTTON_I18N[locale].loading;

  const layoutStyles = isIconOnly
    ? "size-11 p-0"
    : "h-[49px] min-w-[181px] px-4";

  const baseStyles = [
    "inline-flex items-center justify-center gap-2.5",
    "rounded-[10px] font-normal text-base leading-none",
    "transition-colors cursor-pointer",
    "disabled:cursor-not-allowed disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",
    layoutStyles,
  ].join(" ");

  const displayIcon = isIconOnly ? (leftIcon ?? rightIcon) : leftIcon;

  return (
    <button
      type={type}
      disabled={isDisabled}
      data-loading={isLoading ? "" : undefined}
      aria-busy={isLoading || undefined}
      className={`${baseStyles} ${variantStyles[resolved]} ${className}`}
      {...props}
    >
      {isIconOnly ? (
        isLoading ? (
          <LoaderCircle
            className="animate-spin shrink-0"
            size={18}
            aria-hidden
          />
        ) : (
          displayIcon && (
            <span className="shrink-0 inline-flex">{displayIcon}</span>
          )
        )
      ) : (
        <>
          {!isLoading && displayIcon && (
            <span className="shrink-0 inline-flex">{displayIcon}</span>
          )}
          <span>{isLoading ? resolvedLoadingText : children}</span>
          {isLoading ? (
            <LoaderCircle
              className="animate-spin shrink-0"
              size={18}
              aria-hidden
            />
          ) : (
            rightIcon && (
              <span className="shrink-0 inline-flex">{rightIcon}</span>
            )
          )}
        </>
      )}
    </button>
  );
};
