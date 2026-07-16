import { type ReactNode } from "react";
import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type StatusVariant = "success" | "warning" | "error" | "info";

export type BadgeVariant =
  "primary" | "secondary" | "subtle" | "outline" | StatusVariant;

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: ReactNode | null;
}

const defaultIcons: Partial<Record<BadgeVariant, ReactNode>> = {
  info: <Info size={10} strokeWidth={2} aria-hidden />,
  success: <CheckCircle size={10} strokeWidth={2} aria-hidden />,
  warning: <AlertTriangle size={10} strokeWidth={2} aria-hidden />,
  error: <XCircle size={10} strokeWidth={2} aria-hidden />,
};

const variantStyles: Record<BadgeVariant, string> = {
  primary:
    "bg-primary text-white dark:text-zinc-950 hover:bg-primary-hover dark:hover:bg-soft-pink-400",
  secondary:
    "bg-primary-light text-primary hover:bg-maroon-100 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600",
  subtle:
    "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600",
  outline:
    "bg-transparent border border-primary text-primary dark:border-soft-pink-300 dark:text-soft-pink-300",
  success:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
};

export const Badge = ({
  children,
  variant = "primary",
  className = "",
  icon,
}: BadgeProps) => {
  const resolvedIcon =
    icon === undefined ? (defaultIcons[variant] ?? null) : icon;

  return (
    <span
      className={[
        "inline-flex items-center justify-center gap-1.5",
        "h-8 px-2",
        "rounded-full text-[12px] font-medium leading-none whitespace-nowrap",
        "transition-colors",
        variantStyles[variant],
        className,
      ].join(" ")}
    >
      {resolvedIcon && (
        <span className="shrink-0 inline-flex">{resolvedIcon}</span>
      )}
      {children}
    </span>
  );
};
