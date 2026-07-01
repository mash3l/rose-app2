"use client";

import { Link } from "@/i18n/routing";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex overflow-x-auto whitespace-nowrap hide-scrollbar">
      <ol className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isEllipsis = item.label === "...";

          return (
            <li key={index} className="flex items-center gap-2">
              {isEllipsis ? (
                <span className="text-zinc-500 dark:text-zinc-400 tracking-widest pointer-events-none">
                  ...
                </span>
              ) : isLast || !item.href ? (
                <span
                  className="font-normal text-maroon-500 dark:text-soft-pink-300 pointer-events-none"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-normal hover:text-maroon-500 dark:hover:text-soft-pink-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-500/30 dark:focus-visible:ring-soft-pink-300/30 rounded-sm"
                >
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <div className="opacity-50 flex items-center">
                  <ChevronRight className="w-4 h-4 ltr:block rtl:hidden" />
                  <ChevronLeft className="w-4 h-4 ltr:hidden rtl:block" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
