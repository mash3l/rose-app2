"use client";

import React, { useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isError?: boolean;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-label"?: string;
}

export const OtpInput = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  isError = false,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
}: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpArray = Array.from({ length }, (_, i) => value[i] || "");

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otpArray];
    newOtp[index] = val.substring(val.length - 1);
    onChange(newOtp.join(""));

    if (val && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      if (!otpArray[index] && index > 0) {
        const newOtp = [...otpArray];
        newOtp[index - 1] = "";
        onChange(newOtp.join(""));
        focusInput(index - 1);
      } else {
        const newOtp = [...otpArray];
        newOtp[index] = "";
        onChange(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const isRtl = document.documentElement.dir === "rtl";
      focusInput(index + (isRtl ? 1 : -1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const isRtl = document.documentElement.dir === "rtl";
      focusInput(index + (isRtl ? -1 : 1));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").slice(0, length);
    onChange(newOtp.join(""));
    focusInput(Math.min(newOtp.length, length - 1));
  };

  return (
    <div
      id={id}
      role="group"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className="flex items-center gap-2"
      dir="ltr"
    >
      {otpArray.map((digit, index) => (
        <input
          key={index}
          id={id ? `${id}-${index}` : undefined}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-invalid={ariaInvalid || isError || undefined}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel ? `${ariaLabel} ${index + 1}` : undefined}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={[
            "w-12 h-14 text-center text-xl font-bold rounded-[10px] border transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-muted disabled:opacity-100",
            isError
              ? "border-danger bg-danger/10 text-danger focus-visible:ring-danger/40 focus-visible:border-danger"
              : "border-border bg-card text-foreground hover:border-primary/50 focus-visible:ring-primary/40 focus-visible:border-primary",
          ].join(" ")}
        />
      ))}
    </div>
  );
};
