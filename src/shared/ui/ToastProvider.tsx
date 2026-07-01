"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Check, X, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5" />;
      case "error":
        return <X className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 border-emerald-700 text-emerald-900 dark:bg-emerald-300 dark:border-zinc-800 dark:text-zinc-900";
      case "error":
        return "bg-red-50 border-red-700 text-red-900 dark:bg-red-300 dark:border-zinc-800 dark:text-zinc-900";
      case "warning":
        return "bg-amber-50 border-amber-700 text-amber-900 dark:bg-amber-300 dark:border-zinc-800 dark:text-zinc-900";
      case "info":
      default:
        return "bg-zinc-100 border-zinc-400 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300";
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none w-full sm:w-[447px] max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "pointer-events-auto flex items-start w-full min-h-[53px]",
              "rounded-[10px] border pt-4 pb-4 ps-4 pe-8 gap-[10px]",
              "shadow-[0_15px_30px_-3px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_30px_-3px_rgba(0,0,0,0.3)]",
              "transition-all duration-300 animate-in slide-in-from-right-8 fade-in relative",
              getStyles(t.type),
            ].join(" ")}
            role="alert"
          >
            <div className="flex items-center gap-[10px] mt-0.5">
              {getIcon(t.type)}
              <span className="text-sm font-normal">{t.message}</span>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="absolute top-4 end-3 opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
