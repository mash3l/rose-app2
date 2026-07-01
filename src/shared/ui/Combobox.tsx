"use client";

import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { ChevronDown, Check, Search, LoaderCircle } from "lucide-react";

export const COMBOBOX_I18N = {
  en: {
    placeholder: "Select an option",
    search: "Search...",
    noOptions: "No options found",
  },
  ar: {
    placeholder: "اختر خياراً",
    search: "بحث...",
    noOptions: "لا توجد خيارات",
  },
} as const;

export type ComboboxLocale = keyof typeof COMBOBOX_I18N;

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  noOptionsText?: string;
  error?: boolean;
  errorMessage?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  locale?: ComboboxLocale;
  className?: string;
}

export const Combobox = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  searchPlaceholder,
  noOptionsText,
  error = false,
  errorMessage,
  disabled = false,
  isLoading = false,
  locale = "en",
  className = "",
}: ComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const i18n = COMBOBOX_I18N[locale];
  const resolvedPlaceholder = placeholder ?? i18n.placeholder;
  const resolvedSearchPlaceholder = searchPlaceholder ?? i18n.search;
  const resolvedNoOptionsText = noOptionsText ?? i18n.noOptions;

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setActiveIndex(0);
    }
  }, [isOpen, searchQuery]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (onChange) onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[activeIndex]) {
        handleSelect(filteredOptions[activeIndex].value);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className={`flex w-full flex-col gap-1.5 relative ${className}`} ref={containerRef}>
      {label && (
        <label
          className={`text-base font-normal ${
            disabled ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={[
          "flex h-[49px] w-full items-center justify-between rounded-[10px] border bg-card px-4 text-base font-normal transition-colors text-start shadow-sm",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",
          error
            ? "border-danger focus-visible:border-danger focus-visible:ring-danger/40"
            : "border-border hover:border-primary/50",
          isOpen && !error ? "border-primary ring-2 ring-primary/20" : "",
        ].join(" ")}
      >
        <span className={selectedOption ? "text-foreground font-medium" : "text-muted-foreground line-clamp-1"}>
          {selectedOption ? selectedOption.label : resolvedPlaceholder}
        </span>
        <ChevronDown size={20} className={`text-muted-foreground shrink-0 ms-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] z-50 flex w-full flex-col rounded-[10px] border border-border bg-card shadow-lg overflow-hidden">
          <div className="flex items-center border-b border-border/50 px-3 py-3">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={resolvedSearchPlaceholder}
              className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground text-foreground font-medium"
            />
          </div>

          <div className="max-h-[224px] overflow-y-auto p-2 flex flex-col gap-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <LoaderCircle className="animate-spin" size={24} />
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const isActive = index === activeIndex;
                const isSelected = value === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={[
                      "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition-all text-start",
                      isActive ? "bg-primary-light text-primary dark:bg-primary/20" : "text-foreground hover:bg-muted/50",
                      isSelected ? "font-semibold" : "font-normal",
                    ].join(" ")}
                  >
                    <span className="line-clamp-1">{opt.label}</span>
                    {isSelected && <Check size={18} className="text-primary shrink-0 ms-2" />}
                  </button>
                );
              })
            ) : (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                {resolvedNoOptionsText}
              </div>
            )}
          </div>
        </div>
      )}

      {error && errorMessage && (
        <span className="text-sm text-danger">{errorMessage}</span>
      )}
    </div>
  );
};