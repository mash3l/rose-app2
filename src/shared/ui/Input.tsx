"use client";

import {
  forwardRef,
  useState,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Eye, EyeOff, Search, Plus, Minus } from "lucide-react";

export const INPUT_I18N = {
  en: {
    required: "This field is required",
    invalidEmail: "Invalid email address",
    showPassword: "Show password",
    hidePassword: "Hide password",
    fileSelected: "File selected",
  },
  ar: {
    required: "هذا الحقل مطلوب",
    invalidEmail: "عنوان بريد إلكتروني غير صالح",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    fileSelected: "تم اختيار الملف",
  },
} as const;

export type InputLocale = keyof typeof INPUT_I18N;

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  errorMessage?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  locale?: InputLocale;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      errorMessage,
      type = "text",
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      locale = "en",
      id,
      ...props
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const resolvedErrorMessage =
      typeof error === "string" ? error : errorMessage;
    const errorId = error ? `${inputId}-error` : undefined;

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const internalRef = useRef<HTMLInputElement>(null);

    const isPassword = type === "password";
    const isSearch = type === "search";
    const isNumber = type === "number";
    const isFile = type === "file";

    const inputType = isPassword
      ? isPasswordVisible
        ? "text"
        : "password"
      : type;
    const defaultLeftIcon = isSearch ? (
      <Search size={18} className="text-muted-foreground" />
    ) : (
      leftIcon
    );

    const handleIncrement = () => {
      const input = internalRef.current;
      if (input) {
        input.stepUp();
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    const handleDecrement = () => {
      const input = internalRef.current;
      if (input) {
        input.stepDown();
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    const setRefs = (element: HTMLInputElement) => {
      internalRef.current = element;
      if (typeof forwardedRef === "function") {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    };

    return (
      <div className={`flex flex-col gap-2 w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`text-base font-normal ${
              disabled ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            {label} {props.required && <span className="text-danger">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {defaultLeftIcon && (
            <span className="absolute start-4 flex items-center justify-center pointer-events-none">
              {defaultLeftIcon}
            </span>
          )}

          <input
            ref={setRefs}
            id={inputId}
            type={inputType}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={[
              "flex w-full h-[49px] rounded-[10px] border bg-card text-foreground transition-colors",
              "text-base font-normal placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-muted",
              error
                ? "border-danger focus-visible:border-danger focus-visible:ring-danger/40"
                : "border-border hover:border-primary/50 focus-visible:border-primary",
              defaultLeftIcon ? "ps-12" : "ps-4",
              rightIcon || isPassword || isNumber ? "pe-12" : "pe-4",
              isNumber
                ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                : "",
              isFile
                ? "p-0 pe-4 file:bg-primary-light dark:file:bg-primary/20 file:text-primary file:border-0 file:h-full file:px-4 file:me-4 file:font-medium file:cursor-pointer hover:file:bg-primary/10 transition-all cursor-pointer"
                : "",
            ].join(" ")}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute end-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md p-1"
              aria-label={
                isPasswordVisible
                  ? INPUT_I18N[locale].hidePassword
                  : INPUT_I18N[locale].showPassword
              }
            >
              {isPasswordVisible ? (
                <EyeOff size={20} aria-hidden />
              ) : (
                <Eye size={20} aria-hidden />
              )}
            </button>
          ) : isNumber ? (
            <div className="absolute end-2 flex flex-col items-center justify-center gap-0.5">
              <button
                type="button"
                tabIndex={-1}
                onClick={handleIncrement}
                disabled={disabled}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
              </button>
              <button
                type="button"
                tabIndex={-1}
                onClick={handleDecrement}
                disabled={disabled}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={14} />
              </button>
            </div>
          ) : (
            rightIcon && (
              <span className="absolute end-4 flex items-center justify-center pointer-events-none">
                {rightIcon}
              </span>
            )
          )}
        </div>

        {error && resolvedErrorMessage && (
          <p id={errorId} className="text-sm text-danger mt-0.5" role="alert">
            {resolvedErrorMessage}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
