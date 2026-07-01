"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { Upload, File as FileIcon, X } from "lucide-react";

export const FILE_I18N = {
  en: {
    placeholder: "Click or drag to upload a file",
    fileSelected: "File selected",
    fileTooLarge: "File size exceeds {max}MB",
  },
  ar: {
    placeholder: "اضغط أو اسحب لرفع ملف",
    fileSelected: "تم اختيار الملف",
    fileTooLarge: "حجم الملف يتجاوز {max} ميجابايت",
  },
} as const;

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  locale?: keyof typeof FILE_I18N;
  maxSizeInMb?: number;
  onFileClear?: () => void;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      label,
      error,
      className = "",
      disabled,
      locale = "en",
      maxSizeInMb,
      id,
      onChange,
      onFileClear,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [fileName, setFileName] = useState<string | null>(null);
    const [sizeError, setSizeError] = useState<string | null>(null);

    const resolvedError = error ?? sizeError ?? undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file && maxSizeInMb && file.size > maxSizeInMb * 1024 * 1024) {
        setSizeError(
          FILE_I18N[locale].fileTooLarge.replace("{max}", String(maxSizeInMb))
        );
        setFileName(null);
        e.target.value = "";
        return;
      }

      setSizeError(null);
      setFileName(file ? file.name : null);
      onChange?.(e);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      setFileName(null);
      setSizeError(null);
      onFileClear?.();
    };

    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label} {props.required && <span className="text-danger">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="file"
            className="sr-only"
            disabled={disabled}
            onChange={handleChange}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={[
              "flex items-center justify-between w-full h-11 px-4 rounded-xl border border-dashed transition-colors cursor-pointer",
              "bg-background text-foreground",
              "focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/30",
              "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
              resolvedError ? "border-danger" : "border-border hover:border-primary hover:bg-muted/30",
            ].join(" ")}
          >
            <div className="flex items-center gap-3 truncate">
              {fileName ? <FileIcon size={18} className="text-primary shrink-0" /> : <Upload size={18} className="text-muted-foreground shrink-0" />}
              <span className="truncate text-sm">
                {fileName ? fileName : FILE_I18N[locale].placeholder}
              </span>
            </div>
          </label>

          {fileName && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-danger focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {resolvedError && <p className="text-sm text-danger mt-0.5" role="alert">{resolvedError}</p>}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";