"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className = "",
      indeterminate = false,
      error = false,
      errorMessage,
      label,
      disabled,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className={`inline-flex flex-col gap-1.5 ${className}`}>
        <label
          className={[
            "inline-flex items-center gap-2.5 w-fit",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          ].join(" ")}
        >
          <div className="relative flex items-center justify-center size-5 shrink-0">
            <input
              type="checkbox"
              ref={innerRef}
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            <div
              className={[
                "size-5 rounded-[4px] border flex items-center justify-center transition-all",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-background",
                error
                  ? "border-danger peer-checked:bg-danger peer-checked:border-danger peer-indeterminate:bg-danger peer-indeterminate:border-danger"
                  : "border-border peer-checked:bg-maroon-700 dark:peer-checked:bg-primary peer-checked:border-maroon-700 dark:peer-checked:border-primary peer-indeterminate:bg-maroon-700 dark:peer-indeterminate:bg-primary peer-indeterminate:border-maroon-700 dark:peer-indeterminate:border-primary",
                "bg-transparent"
              ].join(" ")}
            >
              <Check
                className="size-3.5 text-white dark:text-zinc-950 hidden peer-checked:block peer-indeterminate:hidden"
                strokeWidth={3}
              />
              <Minus
                className="size-3.5 text-white dark:text-zinc-950 hidden peer-indeterminate:block"
                strokeWidth={3}
              />
            </div>
          </div>
          {label && (
            <span
              className={`text-base font-normal ${
                disabled ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {label}
            </span>
          )}
        </label>
        {error && errorMessage && (
          <span className="text-sm text-danger">{errorMessage}</span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";